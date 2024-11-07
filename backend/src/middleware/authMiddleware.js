import axios from 'axios';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import NodeCache from 'node-cache';
import jose from 'node-jose';
import User from '../models/userModel.js';

const keyCache = new NodeCache({ stdTTL: 3600 });

export const protect = async (req, res, next) => {
  let token;

  if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
  ) {
      try {
          token = req.headers.authorization.split(' ')[1];
          console.log('Token:', token); 

          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
          console.log('Decoded User:', decoded); 

          req.user = await User.findById(decoded.id).select('-password');
          console.log('Authenticated User:', req.user);

          next();
      } catch (error) {
          res.status(401).json({ message: 'Not authorized, token failed' });
      }
  }

  if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
  }
};


const isGoogleToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded && decoded.iss && decoded.iss.includes('accounts.google.com');
};

const getGooglePublicKey = async () => {
  let cachedKey = keyCache.get('googlePublicKey');
  if (!cachedKey) {
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/certs');
    const keys = response.data.keys;

    const jwk = {
      kty: keys[0].kty,
      n: keys[0].n,   
      e: keys[0].e      
    };

    const key = await jose.JWK.asKey(jwk);
    cachedKey = key.toPEM();  
    keyCache.set('googlePublicKey', cachedKey);
  }
  return cachedKey;
};

export const managerAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Inside ",token);
  
  if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log("Decoded token payload:", decoded);
      req.user = decoded; 
      console.log('req.user.role: ',req.user.role);

      if (req.user.role !== 'manager') {
          return res.status(403).json({ message: "Not authorized as a manager" });
      }
      next();
  } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Not authorized, token verification failed" });
  }
};




export const adminAuth = asyncHandler(async (req, res, next) => {
  let token;
  console.log('Inside admin');
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
          token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
          const user  = await User.findById(decoded.id).select('-password');
          if (user && user.role === 'admin') {
            next();
          } else {
            res.status(403);
            throw new Error('Not authorized as an admin');
          }
      } catch (error) {
          console.error("Token verification failed:", error);
          res.status(401);
          throw new Error('Not authorized, token verification failed');
      }
  } else {
      console.log('No token provided');
      res.status(401);
      throw new Error('Not authorized, no token');
  }
});

