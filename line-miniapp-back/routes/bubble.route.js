import bubbleController from "../controllers/bubble.controller.js";

const bubbleRoute = (route) =>{
    route.post("/create", bubbleController.CreateBubble)
    route.post("/delete", bubbleController.deleteBubble)
    route.put("/edit", bubbleController.editBubble)
}

export default bubbleRoute