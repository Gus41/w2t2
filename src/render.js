export default class Render{
    
    constructor(root, service){
        this.root = root
        this.service = service
        this.searchQuery = ""
        this.activeFilter = "all"
        this.renderList()
    }
    createContainer(){
        const container = document.createElement("div")
        container.classList.add("container")
       
        return container
    }
    renderList(){
        const contacts = this.service.getContacts()
        const query = this.searchQuery.trim().toLocaleLowerCase("en-US")
        const favoriteCount = contacts.filter(contact => contact.favorite).length
        const visibleContacts = contacts.filter(contact => {
            const matchesQuery = [contact.name, contact.email, contact.tel]
                .some(value => String(value ?? "").toLocaleLowerCase("en-US").includes(query))
            const matchesFilter = this.activeFilter === "all" || contact.favorite
            return matchesQuery && matchesFilter
        })

        const table = document.createElement("table")
        table.classList.add("contacts-table")
        const thead = document.createElement("thead")
        const tbody = document.createElement("tbody")

        const headerRow = document.createElement("tr")
        const favoriteHeader = document.createElement("th")
        favoriteHeader.scope = "col"
        favoriteHeader.innerText = "Favorite"
        const nameHeader = document.createElement("th")
        nameHeader.scope = "col"
        nameHeader.innerText = "Name"
        const emailHeader = document.createElement("th")
        emailHeader.scope = "col"
        emailHeader.innerText = "E-mail"
        const telHeader = document.createElement("th")
        telHeader.scope = "col"
        telHeader.innerText = "Phone"
        const actionHeader = document.createElement("th")
        actionHeader.scope = "col"
        actionHeader.innerText = "Actions"
        headerRow.appendChild(favoriteHeader)
        headerRow.appendChild(nameHeader)
        headerRow.appendChild(emailHeader)
        headerRow.appendChild(telHeader)
        headerRow.appendChild(actionHeader)
        thead.appendChild(headerRow)

        
        visibleContacts.forEach(contact => {
            const row = document.createElement("tr")
            const favoriteCell = document.createElement("td")
            const favoriteButton = document.createElement("button")
            favoriteButton.type = "button"
            favoriteButton.classList.add("favorite-button")
            favoriteButton.classList.toggle("is-favorite", Boolean(contact.favorite))
            favoriteButton.innerText = contact.favorite ? "★" : "☆"
            favoriteButton.title = contact.favorite ? "Remove from favorites" : "Add to favorites"
            favoriteButton.setAttribute("aria-label", `${favoriteButton.title}: ${contact.name}`)
            favoriteButton.setAttribute("aria-pressed", String(Boolean(contact.favorite)))
            favoriteButton.addEventListener("click", () => {
                this.service.toggleFavorite(contact.id)
                this.renderList()
            })
            favoriteCell.appendChild(favoriteButton)
            const nameCell = document.createElement("td")
            nameCell.innerText = contact.name
            const emailCell = document.createElement("td")
            emailCell.innerText = contact.email
            const telCell = document.createElement("td")
            telCell.innerText = contact.tel
            row.appendChild(favoriteCell)
            row.appendChild(nameCell)
            row.appendChild(emailCell)
            row.appendChild(telCell)
            const actionCell = document.createElement("td")
            actionCell.classList.add("row-actions")
            const editButton = document.createElement("button")
            editButton.type = "button"
            editButton.classList.add("action-button")
            editButton.innerText = "Edit"
            editButton.addEventListener("click", () => {
                this.renderForm(contact)
            })
            const deleteButton = document.createElement("button")
            deleteButton.type = "button"
            deleteButton.classList.add("action-button", "red")
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
        addButton.type = "button"
        addButton.classList.add("primary-button", "add-button")
        addButton.innerText = "Add contact"
        addButton.addEventListener("click", () => {
            this.renderForm(null)
        })

        const title = document.createElement("div")
        title.classList.add("list-heading")
        const heading = document.createElement("h2")
        heading.innerText = "Your contacts"
        const count = document.createElement("p")
        count.innerText = `${contacts.length} ${contacts.length === 1 ? "contact" : "contacts"} · ${favoriteCount} ${favoriteCount === 1 ? "favorite" : "favorites"}`
        title.append(heading, count)

        const search = document.createElement("input")
        search.type = "search"
        search.classList.add("search-input")
        search.placeholder = "Search by name, email, or phone"
        search.setAttribute("aria-label", "Search contacts by name, email, or phone")
        search.value = this.searchQuery
        search.addEventListener("input", event => {
            this.searchQuery = event.target.value
            const cursorPosition = event.target.selectionStart
            this.renderList()
            const updatedSearch = this.root.querySelector(".search-input")
            updatedSearch.focus()
            updatedSearch.setSelectionRange(cursorPosition, cursorPosition)
        })

        const filters = document.createElement("div")
        filters.classList.add("filter-group")
        filters.setAttribute("role", "group")
        filters.setAttribute("aria-label", "Filter contacts")
        const allButton = this.createFilterButton("All", "all")
        const favoritesButton = this.createFilterButton("Favorites", "favorites")
        filters.append(allButton, favoritesButton)

        const toolbar = document.createElement("div")
        toolbar.classList.add("contacts-toolbar")
        const searchAndFilter = document.createElement("div")
        searchAndFilter.classList.add("search-and-filter")
        searchAndFilter.append(search, filters)
        toolbar.append(searchAndFilter, addButton)

        const tableWrap = document.createElement("div")
        tableWrap.classList.add("table-wrap")
        if(visibleContacts.length){
            tableWrap.appendChild(table)
        }else{
            const emptyState = document.createElement("div")
            emptyState.classList.add("empty-state")
            const emptyTitle = document.createElement("h3")
            const emptyMessage = document.createElement("p")
            if(contacts.length === 0){
                emptyTitle.innerText = "Your list starts here"
                emptyMessage.innerText = "Add your first contact to see it in this list."
            }else{
                emptyTitle.innerText = "No contacts found"
                emptyMessage.innerText = this.activeFilter === "favorites" && !query
                    ? "Star contacts to collect them here."
                    : "Try another search term or change the filter."
            }
            emptyState.append(emptyTitle, emptyMessage)
            tableWrap.appendChild(emptyState)
        }

        const container = this.createContainer()
        container.classList.add("contacts-page")
        container.append(title, toolbar, tableWrap)

        this.root.replaceChildren(container)
     }

    createFilterButton(label, filter){
        const button = document.createElement("button")
        button.type = "button"
        button.classList.add("filter-button")
        button.classList.toggle("is-active", this.activeFilter === filter)
        button.setAttribute("aria-pressed", String(this.activeFilter === filter))
        button.innerText = label
        button.addEventListener("click", () => {
            this.activeFilter = filter
            this.renderList()
        })
        return button
    }

    renderForm(contact){
        const form = document.createElement("form")
        form.classList.add("contacts-form")
        const heading = document.createElement("h2")
        heading.innerText = contact ? "Edit contact" : "New contact"

        const nameLabel = document.createElement("label")
        nameLabel.htmlFor = "contact-name"
        nameLabel.innerText = "Name"
        const nameInput = document.createElement("input")
        nameInput.id = "contact-name"
        nameInput.name = "name"
        nameInput.type = "text"
        nameInput.required = true
        nameInput.minLength = 3
        nameInput.maxLength = 50
        nameInput.value = contact ? contact.name : ""

        const emailLabel = document.createElement("label")
        emailLabel.htmlFor = "contact-email"
        emailLabel.innerText = "E-mail"
        const emailInput = document.createElement("input")
        emailInput.id = "contact-email"
        emailInput.name = "email"
        emailInput.type = "email"
        emailInput.required = true
        emailInput.maxLength = 50
        emailInput.value = contact ? contact.email : ""

        const telLabel = document.createElement("label")
        telLabel.htmlFor = "contact-tel"
        telLabel.innerText = "Phone"
        const telInput = document.createElement("input")
        telInput.id = "contact-tel"
        telInput.name = "tel"
        telInput.type = "tel"
        telInput.required = true
        telInput.minLength = 8
        telInput.maxLength = 15
        telInput.value = contact ? contact.tel : ""

        const errorMessage = document.createElement("p")
        errorMessage.classList.add("form-error")
        errorMessage.setAttribute("role", "alert")
        const submitButton = document.createElement("button")
        submitButton.type = "submit"
        submitButton.classList.add("primary-button")
        submitButton.innerText = contact ? "Save changes" : "Create contact"
        const cancelButton = document.createElement("button")
        cancelButton.type = "button"
        cancelButton.classList.add("secondary-button")
        cancelButton.innerText = "Cancel"
        cancelButton.addEventListener("click", () => this.renderList())

        const fields = document.createElement("div")
        fields.classList.add("form-fields")
        fields.append(nameLabel, nameInput, emailLabel, emailInput, telLabel, telInput)
        const actions = document.createElement("div")
        actions.classList.add("form-actions")
        actions.append(cancelButton, submitButton)

        form.append(heading, fields, errorMessage, actions)

        form.addEventListener("submit", (event) => {
            event.preventDefault()
            const newContact = {
                id: contact ? contact.id : Date.now(),
                name: nameInput.value,
                email: emailInput.value,
                tel: telInput.value,
                favorite: contact ? Boolean(contact.favorite) : false
            }
            const saved = contact
                ? this.service.updateContact(newContact)
                : this.service.newContact(newContact)
            if(!saved){
                errorMessage.innerText = "Please check the fields and make sure the values are valid."
                return
            }
            this.renderList()
        })

        const container = this.createContainer()
        container.classList.add("form-page")
        container.appendChild(form)

        this.root.replaceChildren(container)

    }

}