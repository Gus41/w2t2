export default class Repository {
  constructor() {
    this.storageKey = "contacts";
  }

  getAll() {
    const data = localStorage.getItem(this.storageKey);

    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
      return [];
    }
  }

  saveAll(contacts) {
    localStorage.setItem(this.storageKey, JSON.stringify(contacts));
  }

  add(contact) {
    const contacts = this.getAll();
    contacts.push(contact);
    this.saveAll(contacts);
  }

  update(contactEdited) {
    const contacts = this.getAll();
    const index = contacts.findIndex(c => c.id === contactEdited.id);

    if (index !== -1) {
      contacts[index] = contactEdited;
      this.saveAll(contacts);
    }
  }

  remove(id) {
    const contacts = this.getAll();
    const updatedContacts = contacts.filter(c => c.id !== id);
    this.saveAll(updatedContacts);
  }
}