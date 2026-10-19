import Render from "./render.js"
import Repository from "./repository.js"
import ContactService from "./service.js"

function init(){
    console.log("Initializing")
    const root = document.getElementById("root")
    if(!root){
        window.alert("ROOT UNDEFINED!")
        return
    }
    const repository = new Repository()
    const service = new ContactService(repository)
    const render = new Render(root, service)
}
init()