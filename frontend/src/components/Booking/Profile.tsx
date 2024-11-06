import React from 'react';
import Button from "../ui/Button.js";

export default function ProfileSection({ name, email, profileImage }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Profile photo</h2>
        <p className="text-sm text-muted-foreground">Hosts want to know who's staying at their place.</p>
        {profileImage ? (
          <img src={profileImage} alt="Profile" className="w-16 h-16 rounded-full" />
        ) : (
          <Button variant="primary">Add</Button>
        )}
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Host's Information</h2>
        <p className="text-sm">{name}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}
