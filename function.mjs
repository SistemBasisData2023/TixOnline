  //Function to check wether the username is already taken or not
  async function checkUsernameAvailability(username) {
    try {
      // Query the table for the specified username
      const query = 'SELECT * FROM users WHERE username = $1';
      const values = [username];
      const result = await db.query(query, values);

      // Return true if the username is available (no matching rows found), false otherwise
      if(result.rowCount > 0){
        return true;
      }else{
        return false;
      }
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false; // Return false in case of an error
    }
}

 //Function to check wether the email is already taken or not
 async function checkEmailAvailability(email) {
    try {
      // Query the table for the specified email
      const query = 'SELECT * FROM users WHERE email = $1';
      const values = [email];
      const result = await db.query(query, values);

      // Return true if the email is available (no matching rows found), false otherwise
      if(result.rowCount > 0){
        return true;
      }else{
        return false;
      }
    } catch (error) {
      console.error('Error checking email availability:', error);
      return false; // Return false in case of an error
    }
}
  //Function to check wether the phone number is already taken or not
  async function checkUsernameAvailability(uphone_number) {
    try {
      // Query the table for the specified username
      const query = 'SELECT * FROM users WHERE phone_number = $1';
      const values = [phone_number];
      const result = await db.query(query, values);

      // Return true if the phone number is available (no matching rows found), false otherwise
      if(result.rowCount > 0){
        return true;
      }else{
        return false;
      }
    } catch (error) {
      console.error('Error checking phone number availability:', error);
      return false; // Return false in case of an error
    }
  }

    //Function to check wether the username is already taken or not
  async function checkUsernameAvailability(username) {
    try {
      // Query the table for the specified username
      const query = 'SELECT * FROM users WHERE username = $1';
      const values = [username];
      const result = await db.query(query, values);

      // Return true if the username is available (no matching rows found), false otherwise
      if(result.rowCount > 0){
        return true;
      }else{
        return false;
      }
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false; // Return false in case of an error
    }
}

 //Function to check wether the email is already taken or not
 async function checkEmailAdminAvailability(email) {
  try {
    // Query the table for the specified email
    const query = 'SELECT * FROM Admins WHERE email = $1';
    const values = [email];
    const result = await db.query(query, values);

    // Return true if the email is available (no matching rows found), false otherwise
    if(result.rowCount > 0){
      return true;
    }else{
      return false;
    }
  } catch (error) {
    console.error('Error checking email availability:', error);
    return false; // Return false in case of an error
  }
}

    //Function to check wether the username is already taken or not
    async function checkUsernameAdminAvailability(username) {
      try {
        // Query the table for the specified username
        const query = 'SELECT * FROM Admins WHERE username = $1';
        const values = [username];
        const result = await db.query(query, values);
  
        // Return true if the username is available (no matching rows found), false otherwise
        if(result.rowCount > 0){
          return true;
        }else{
          return false;
        }
      } catch (error) {
        console.error('Error checking username availability:', error);
        return false; // Return false in case of an error
      }
  }