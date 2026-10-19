import Render from "./render"
import Repository from "./repository"
import ContactService from "./service"

function init(){
    const root = document.getElementById("root")
    if(!root){
        window.alert("ROOT UNDEFINED!")
        return
    }
    const repository = new Repository()
    const service = new ContactService(repository)
    const render = new Render(root, service)
}