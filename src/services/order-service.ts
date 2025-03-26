import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import { OrderDTO } from "../models/order";


export function findByIdRequest(id: number) {
    
    const config : AxiosRequestConfig = {
        url: `/orders/${id}`,
        withCredentials: true /*precisa de autorização token para acesasr essa página ur
        isso é configurado no backend*/
    }

    return requestBackend(config);
}

/*Função para salvar um pedido que contem um ou mais produto*/

export function placeOrderRequest(cart: OrderDTO) {

        /* vamos salvar lá no backend por isso usamos o axio*/
    const config : AxiosRequestConfig = {
        url: "/orders",
        method: "POST",
        withCredentials: true, /*precisa estar logado*/
        data: cart /* o corpo se chamada data no axio da pra ver é o body lá no postman, e oque tem dentro 
        do corpo do pedido é o carrinho, porque o carrinho  que estamos passando como argumento
         dessa função, porque no cart(carrinmh) tm o produtos do pedido*/
    }

    return requestBackend(config);
}

export function findAll() {
    
    const config : AxiosRequestConfig = {
        url: `/orders`,
        method: "GET",
        withCredentials: true, /*precisa de autorização token para acesasr essa página ur
        isso é configurado no backend*/
   
    }

    return requestBackend(config);
}

