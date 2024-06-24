"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyContactController = void 0;
const typeORMConfig_1 = require("../config/typeORMConfig");
const Contact_1 = require("../models/Contact");
const identifyContactController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber } = req.body;
    try {
        const contactRepository = typeORMConfig_1.DataSourceConfig.getRepository(Contact_1.Contact);
        // Find primary contact based on email or phoneNumber
        let primaryContact = yield contactRepository.findOne({
            where: [
                { email, linkPrecedence: 'primary' },
                { phoneNumber, linkPrecedence: 'primary' },
            ],
        });
        // Handle scenarios with null values
        if (!primaryContact) {
            if (email) {
                // Find existing contact by email
                primaryContact = yield contactRepository.findOne({
                    where: { email, linkPrecedence: 'primary' },
                });
            }
            else if (phoneNumber) {
                // Find existing contact by phoneNumber
                primaryContact = yield contactRepository.findOne({
                    where: { phoneNumber, linkPrecedence: 'primary' },
                });
            }
            // If no existing contact found, create a new one
            if (!primaryContact) {
                primaryContact = yield contactRepository.save({
                    phoneNumber,
                    email,
                    linkPrecedence: 'primary',
                });
            }
        }
        // Find secondary contacts linked to the primary contact
        const secondaryContacts = yield contactRepository.find({
            where: {
                linkedId: primaryContact.id,
                linkPrecedence: 'secondary',
            },
        });
        // Check if secondary contact needs to be created
        if (primaryContact &&
            (email !== primaryContact.email || phoneNumber !== primaryContact.phoneNumber)) {
            // Find if there's already a secondary contact with the same email or phoneNumber
            const existingSecondaryContact = yield contactRepository.findOne({
                where: [
                    { email, linkedId: primaryContact.id, linkPrecedence: 'secondary' },
                    { phoneNumber, linkedId: primaryContact.id, linkPrecedence: 'secondary' },
                ],
            });
            // If no existing secondary contact found, create a new one
            if (!existingSecondaryContact) {
                const newSecondaryContact = yield contactRepository.save({
                    phoneNumber,
                    email,
                    linkedId: primaryContact.id,
                    linkPrecedence: 'secondary',
                });
                // Add new secondary contact to response
                secondaryContacts.push(newSecondaryContact);
            }
        }
        // Construct response format
        const response = {
            contact: {
                primaryContactId: primaryContact.id,
                emails: [primaryContact.email, ...secondaryContacts.map(c => c.email)],
                phoneNumbers: [primaryContact.phoneNumber, ...secondaryContacts.map(c => c.phoneNumber)],
                secondaryContactIds: secondaryContacts.map(c => c.id),
            },
        };
        // Send response
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Error identifying contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.identifyContactController = identifyContactController;
