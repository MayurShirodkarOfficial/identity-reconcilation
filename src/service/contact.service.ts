import { DataSourceConfig } from '../config/typeORMConfig';
import { Contact } from '../models/Contact';

export class ContactService {
    private contactRepository: any;
    constructor() {
        this.contactRepository = DataSourceConfig.getRepository(Contact);
    }


    async identifyContact(email: string, phoneNumber: string): Promise<any> {
        let primaryContact = await this.findOrCreatePrimaryContact(email, phoneNumber);
        const secondaryContacts = await this.findSecondaryContacts(primaryContact);
        const response = this.buildResponse(primaryContact, secondaryContacts);
        return response;
    }



    private async findOrCreatePrimaryContact(email: string, phoneNumber: string): Promise<any> {
        let primaryContact;
        // Find primary contact based on email or phoneNumber
        primaryContact = await this.contactRepository.findOne({
            where: [
                { email, linkPrecedence: 'primary' },
                { phoneNumber, linkPrecedence: 'primary' },
            ],
        });

        if (!primaryContact) {
            // If no primary contact found, create a new one
            primaryContact = await this.contactRepository.save({
                phoneNumber,
                email,
                linkPrecedence: 'primary',
            });
        }

        return primaryContact;
    }
    

    private async findSecondaryContacts(primaryContact: any): Promise<any[]> {
        const secondaryContacts = await this.contactRepository.find({
            where: {
                linkedId: primaryContact.id,
                linkPrecedence: 'secondary',
            },
        });
        return secondaryContacts;
    }


    private buildResponse(primaryContact: any, secondaryContacts: any[]): any {
        const uniquePhoneNumbers = Array.from(new Set([primaryContact.phoneNumber, ...secondaryContacts.map(c => c.phoneNumber)]));
        const response = {
            contact: {
                primaryContactId: primaryContact.id,
                emails: [primaryContact.email, ...secondaryContacts.map(c => c.email)],
                phoneNumbers: uniquePhoneNumbers,
                secondaryContactIds: secondaryContacts.map(c => c.id),
            },
        };
        return response;
    }
}
