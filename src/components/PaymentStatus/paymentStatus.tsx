import  { useState, useEffect } from 'react';
import axios from 'axios';

interface PaymentStatusProps {
    paymentIntentId: string;
}

export default function PaymentStatus({ paymentIntentId }: PaymentStatusProps) {
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (paymentIntentId) {
            axios.get(`http://localhost:8091/mercado-pago-payment-status/${paymentIntentId}`)
                .then(response => {
                    setPaymentStatus(response.data);
                })
                .catch(error => {
                    console.error('Erro ao obter status do pagamento:', error);
                    setError('Erro ao obter status do pagamento.');
                });
        }
    }, [paymentIntentId]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!paymentStatus) {
        return <p>Carregando status do pagamento...</p>;
    }

    return (
        <div>
            <h2>Status do Pagamento</h2>
            <pre>{JSON.stringify(paymentStatus, null, 2)}</pre>
        </div>
    );
}
