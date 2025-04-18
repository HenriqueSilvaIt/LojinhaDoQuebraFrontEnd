import { PaymentMethod } from "../models/payment";
import * as paymentRepository from '../localstorage/payment-repository';

export function savePayment(cart: PaymentMethod) {
    paymentRepository.paymentMethodSave(cart);
}


/*função para retorna um objeto */
export function getCart() : PaymentMethod{
    return paymentRepository.get();
}
