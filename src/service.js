export default class ContactService{
    constructor(repository){
        this.contacts = []
        this.repository = repository;
        this.load();
    }
    getContacts(){
        return this.contacts
    }
    load() {
        this.contacts = this.repository.getAll();
    }

    //TODO: throw errors instead of returning false
    validate(contact){
        if(!contact.name || !contact.email || !contact.tel){
            return false
        }
        if(contact.name.length < 3 || contact.name.length > 50){
            return false
        }
        if(contact.email.length < 5 || contact.email.length > 50){
            return false
        }
        if(contact.tel.length < 8 || contact.tel.length > 15){
            return false
        }
        return true
    }
    
    newContact(contact){
        if(!this.validate(contact)){
            return false;
        }
        this.repository.add(contact);
        this.load(); //---------------------------
        return true;
    }

    updateContact(contact){
        if(!this.validate(contact)){
            return false;
        }
        this.repository.update(contact);
        this.load(); //---------------------------
        return true;
    }
    deleteContact(id){
        this.repository.remove(id);
        this.load(); //---------------------------
    }
}