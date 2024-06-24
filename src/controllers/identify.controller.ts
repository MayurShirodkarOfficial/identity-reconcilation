import { Request, Response } from 'express';
import { ContactService } from '../service/contact.service';

export const identifyContactController = async (req: Request, res: Response): Promise<void> => {
  const { email, phoneNumber } = req.body;

  try {
    const contactService = new ContactService();
    const response = await contactService.identifyContact(email, phoneNumber);
    res.status(200).json(response);
  } 
  
  catch (error) {
    console.error('Error identifying contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
