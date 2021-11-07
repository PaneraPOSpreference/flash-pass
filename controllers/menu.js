import MenuModel from '../model/Menu'

// get menu
export const getMenuHandler = async (req, res) => {
  try {
    const result = await MenuModel.find({})

    // if result not found, return error
    console.log("menu result:", result)

    if(!result) {
      // send error
      return res.status(404).send({
        ok: false,
        message: 'no entries found in database'
      });
    }

    return res.status(200).send({
      ok: true,
      message: "Menu found",
      data: result
    })

  } catch(error) {
    console.log("mongoose error:", error)

    return res.status(400).send({
      ok: false,
      message: "Error getting menu: " + error.message
    })
  }
}
