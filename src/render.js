export default class Render{
    
    constructor(root, service){
        this.root = root
        this.service = service
        this.renderList()
    }
    createContainer(){
        const container = document.createElement("div")
        container.classList.add("container")
        return container
    }
    renderList(){
        const contacts = this.service.getContacts()

        const table = document.createElement("table")
        const thead = document.createElement("thead")
        const tbody = document.createElement("tbody")

        const headerRow = document.createElement("tr")
        const nameHeader = document.createElement("th")
        nameHeader.innerText = "Nome"
        const emailHeader = document.createElement("th")
        emailHeader.innerText = "E-mail"
        const telHeader = document.createElement("th")
        telHeader.innerText = "Telefone"
        const actionHeader = document.createElement("th")
        actionHeader.innerText = "Actions"
        headerRow.appendChild(nameHeader)
        headerRow.appendChild(emailHeader)
        headerRow.appendChild(telHeader)
        headerRow.appendChild(actionHeader)
        thead.appendChild(headerRow)

        
        contacts.forEach(contact => {
            const row = document.createElement("tr")
            const nameCell = document.createElement("td")
            nameCell.innerText = contact.name
            const emailCell = document.createElement("td")
            emailCell.innerText = contact.email
            const telCell = document.createElement("td")
            telCell.innerText = contact.tel
            row.appendChild(nameCell)
            row.appendChild(emailCell)
            row.appendChild(telCell)
            const actionCell = document.createElement("td")
            const editButton = document.createElement("button")
            editButton.innerText = "Edit"
            editButton.addEventListener("click", () => {
                this.renderForm(contact)
            })
            const deleteButton = document.createElement("button")
            deleteButton.innerText = "Delete"
            deleteButton.addEventListener("click", () => {
                this.service.deleteContact(contact.id)
                this.renderList()
            })
            actionCell.appendChild(editButton)
            actionCell.appendChild(deleteButton)
            row.appendChild(actionCell)
            tbody.appendChild(row)
        })

        table.appendChild(thead)
        table.appendChild(tbody)

        const addButton = document.createElement("button")
        addButton.innerText = "New Contact"
        addButton.addEventListener("click", () => {
            this.renderForm(null)
        })

        const container = this.createContainer()
        container.appendChild(table)
        container.appendChild(addButton)

        this.root.replaceChildren(container)
     }
    renderForm(contact){
        //contact can bee null
        const form = document.createElement("form")
        const nameInput = document.createElement("input")
        nameInput.placeholder = "Nome"
        nameInput.value = contact ? contact.name : ""
        const emailInput = document.createElement("input")
        emailInput.placeholder = "E-mail"
        emailInput.value = contact ? contact.email : ""
        const telInput = document.createElement("input")
        telInput.placeholder = "Telefone"
        telInput.value = contact ? contact.tel : ""
        const submitButton = document.createElement("button")
        submitButton.type = "submit"
        submitButton.innerText = contact ? "Update" : "Create"

        form.appendChild(nameInput)
        form.appendChild(emailInput)
        form.appendChild(telInput)
        form.appendChild(submitButton)

        form.addEventListener("submit", (event) => {
            event.preventDefault()
            const newContact = {
                id: contact ? contact.id : Date.now(),
                name: nameInput.value,
                email: emailInput.value,
                tel: telInput.value
            }
            if(contact){
                this.service.updateContact(newContact)
            }else{
                this.service.newContact(newContact)
            }
            this.renderList()
        })

        const container = this.createContainer()
        container.appendChild(form)

        this.root.replaceChildren(container)

    }

}