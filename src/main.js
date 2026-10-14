import Render from "./render"
import ContactService from "./service"

function init(){
    const root = document.getElementById("root")
    if(!root){
        window.alert("ROOT UNDEFINED!")
        return
    }

    const service = new ContactService()
    //TODO: Render should recive the service?
    // root -> render <-> serivce 
    const render = new Render()
}