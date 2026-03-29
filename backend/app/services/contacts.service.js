const { ObjectId } = require("mongodb");

class ContactsService {
  constructor(client) {
    this.Contact = client.db().collection("contacts");
  }

  extractContactData(payload) {
    const contact = {
      name: payload.name?.trim(),
      email: payload.email?.trim(),
      subject: payload.subject?.trim(),
      content: payload.content?.trim(),
      status: payload.status || "pending",
      admin_reply: payload.admin_reply || "",
      replied_at: payload.replied_at || null,
      created_at: payload.created_at || new Date(),
      updated_at: new Date(),
    };

    Object.keys(contact).forEach((key) => {
      if (contact[key] === undefined) delete contact[key];
    });

    return contact;
  }

  async create(payload) {
    const document = this.extractContactData(payload);
    const result = await this.Contact.insertOne(document);
    return {
      _id: result.insertedId,
      ...document,
    };
  }

  async find(filter = {}) {
    return await this.Contact.find(filter).sort({ created_at: -1 }).toArray();
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) return null;
    return await this.Contact.findOne({ _id: new ObjectId(id) });
  }

  async update(id, payload) {
    if (!ObjectId.isValid(id)) return null;

    const updateData = this.extractContactData({
      ...payload,
      updated_at: new Date(),
    });

    delete updateData.created_at;

    const result = await this.Contact.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" },
    );

    return result;
  }

  async reply(id, payload) {
    if (!ObjectId.isValid(id)) return null;

    const updateData = {
      admin_reply: payload.admin_reply?.trim() || "",
      status: "replied",
      replied_at: new Date(),
      updated_at: new Date(),
    };

    const result = await this.Contact.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" },
    );

    return result;
  }

  async delete(id) {
    if (!ObjectId.isValid(id)) return null;
    return await this.Contact.findOneAndDelete({ _id: new ObjectId(id) });
  }

  async deleteAll() {
    const result = await this.Contact.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = ContactsService;
