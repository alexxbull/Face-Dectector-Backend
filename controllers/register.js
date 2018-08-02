const handleRegister = (db, bcrypt) => (req, res) =>
{
   const { email, name, password } = req.body;

   if (!email || !name || !password)
    return res.status(400).json('invalid form submission')

   const salt = bcrypt.genSaltSync(10)
   const hash = bcrypt.hash(password, salt, null, (err, hash) => {
       // Store hash in your password DB.
       db.transaction(trx => {
         trx.insert({
           email: email,
           hash: hash,
         })
         .into('login')
         .returning('email')
         .then(loginEmail => {
           return trx('users')
              .returning('*')
              .insert({
                 email: loginEmail[0],
                 name: name,
                 joined: new Date(),
              })
              .then(user => res.json(user[0]))
         })
         .then(trx.commit)
         .catch(trx.rollback)
       })
       .catch(err => res.status(400).json('unable to register'))
   });
}

module.exports = {
  handleRegister: handleRegister,
}
