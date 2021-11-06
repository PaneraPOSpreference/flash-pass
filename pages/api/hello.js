const helloHandler = (req, res) => {
  return res.status(200).send({ ok: true, message: "Hello World!" })
}

export default helloHandler