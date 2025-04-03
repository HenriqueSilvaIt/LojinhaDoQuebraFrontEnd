import { useEffect, useState } from "react";
import * as mercadoPagoService from '../../services/mercado-pago';

export default function  Payment  ()  {

    const [valor, setValor] = useState(0);
    const [paymentIntentId, setPaymentIntentId] = useState('');
    const [statusPagamento, setStatusPagamento] = useState('');


    const handlePagamento = () => {
     
        mercadoPagoService.obterTokenMercadoPago()
        .then (response => {
            const accessToken = response.data.access_token;
            console.log(response.data.access_token);
            mercadoPagoService.saveAcessToken(accessToken);
            mercadoPagoService.criarIntencaoPagamento({
                "amount": 100,
                "description": "Tauana Beuty",
                "payment": {
                  "installments": 1,
                  "type": "debit_card",
                  "installments_cost": "seller"
                },
                "additional_info": {
                  "external_reference": "12321hadas-12321jasd-12321jasda-123j213asd",
                  "print_on_terminal": true
                }
              
            }).then(response => {
                setPaymentIntentId(response.data.Id)
            })
        } )
        
        /*
        mercadoPagoService.criarIntencaoPagamento(deviceId, {
            amount: valor * 100,
            description: 'Pagamento de teste',
            payment: { type: 'credit_card', installments: 1 }
        }).then(response => {
            setPaymentIntentId(response.data.id);
        });*/
    };

    useEffect(() => {
        if (paymentIntentId) {
            const interval = setInterval(() => {
                mercadoPagoService.obterStatusIntencaoPagamento(paymentIntentId).then(response => {
                    setStatusPagamento(response.data.state);
                });
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [paymentIntentId]);

    return (
       <div>
       
            <input type="number" value={valor} onChange={e => setValor(Number(e.target.value))} />
            <button onClick={handlePagamento}>Pagar</button>
            {statusPagamento && <p>Status do pagamento: {statusPagamento}</p>}
        </div>
    );

}
