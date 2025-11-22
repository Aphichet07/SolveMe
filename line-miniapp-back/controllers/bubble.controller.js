import bubbleService from "../services/bubble.sevice.js"


const bubbleController = {
    CreateBubble: async (req, res) => {
        try {
            const { title, description, expiresInMinutes, userId } = req.body;
            console.log("Body : ", req.body)


            if (!title || !dest || !profile) {
                res.status(500).json({ message: "Internal server error" })
            }

            const bubble = await bubbleService.createBubble(title, description, expiresInMinutes, userId )
            res.status(200).json( bubble )

        } catch (err) {
            console.log("Error : ", err)
            res.status(500).json({ message: "Internal server error" })
        }
    },

    deleteBubble: async (req, res) => {
        try {
            const bubbleId = req.body
            if (!bubbleId) {
                res.status(500).json({ message: "Kuy" })
            }

            const bubble = await bubbleService.deleteBubble
            res.status(200).json({ message: "Deleted" })
        } catch (err) {
            console.log("Error : ", err)
            res.status(500).json({ message: "Internal server error" })
        }
    },

    editBubble: async (req, res) => {
        try {
            const { bubbleid, title, dest } = req.body
            if (!bubbleid || !title || !dest) {
                res.status(500).json({ message: "Kuy" })
            }

            const bubble = await bubbleService.
                res.status(200).json({ messsage: "Edit success", bubble: bubble })
        } catch (err) {
            console.log("Internal server error")
            res.status(500)
        }
    }
}

export default bubbleController 