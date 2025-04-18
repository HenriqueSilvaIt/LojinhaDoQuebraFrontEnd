import { PaymentMethod } from "../models/payment";
import {PAYMENT_Key} from '../utils/system'

export function paymentMethodSave(payment: PaymentMethod) {
    const obj = JSON.stringify(payment)
localStorage.setPaymentMethod(PAYMENT_Key, obj);

}

/*método utilziado para buscar do local storage */

export function get(): PaymentMethod {
    const str = localStorage.getItem(PAYMENT_Key) || '';
    const obj = JSON.parse(str) as PaymentMethod;

    /* criando objeto e percorrendo item dto para o proto type reconhecer o objet 
    OrderItem */
  

    return obj;
}