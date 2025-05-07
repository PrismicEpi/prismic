export const authLogin = async (req, res) => {
  const { username: userName, email, avatar } = req.user.user;
  const user = { userName, email, avatar };

  res.send(user);
}