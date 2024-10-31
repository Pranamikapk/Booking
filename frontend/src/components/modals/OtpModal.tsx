import React, { useEffect, useRef, useState } from 'react';

interface OtpModalProps{
  isVisible : boolean
  otp: string
  setOtp: (otp:string) => void
  resendOtp: ()=> void
  onSubmit: ()=> Promise<boolean>
  closeModal: ()=>void
}

const OtpModal : React.FC<OtpModalProps> = ({ otp, setOtp, resendOtp, onSubmit, closeModal , isVisible}) => {
  const otpLength = 4; 
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);

  useEffect(()=>{
    const timer = setInterval(()=>{
      setTimeLeft((prev)=>{
        if(prev === 1){
          clearInterval(timer)
          setIsResendDisabled(false)
        }
        return prev-1
      })
    },1000)
    return () => clearInterval(timer)
  },[])

  const handleChange = (index: number, value:string) => {
    const newOtp = otp.split('');
    newOtp[index] = value;
    setOtp(newOtp.join(''));

    if (value && index < otpLength - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index : number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const isValid = await onSubmit();
    if (!isValid) {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = () =>{
    resendOtp()
    setTimeLeft(30)
    setIsResendDisabled(true)
  }

  return (
    <div>
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
          <div className="flex justify-between">
            {[...Array(otpLength)].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={otp[index] || ''}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleBackspace(index, e)}
                ref={(el) => (otpRefs.current[index] = el)}
                className="border p-2 text-center w-10 h-10 text-xl mx-1 rounded"
              />
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">
              {error}
            </p>
          )}
          <button onClick={handleSubmit} className="primary mt-4">Submit OTP</button>
          <button
            onClick={closeModal}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>

          <div className="mt-4 text-center">
            <button
              onClick={handleResendOtp}
              disabled={isResendDisabled}
              className={`bg-blue-500 text-white px-4 py-2 rounded ${isResendDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
              Resend OTP {isResendDisabled && `(${timeLeft}s)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpModal;
