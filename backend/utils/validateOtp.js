const validateOtp = async (type, identifier, otp, otpModel) => {
  try{
    const query = {};
    query[type] = identifier;
    query.otp = otp;
  
    const otpRecord = await otpModel.findOne(query);
    if (!otpRecord) {
      return { isValid: false, message: "OTP not found" }; 
    }

    if (otpRecord.expiresAt < Date.now()) {
      return { isValid: false, message: "OTP expired" }; 
    }
  
    await otpModel.deleteOne({ _id: otpRecord._id });
    return { isValid: true, message: "OTP validated successfully" };
  }
  catch(error){
    return false;
  }
};
  export default validateOtp;
  