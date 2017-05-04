import * as React from 'react';
declare var Mercadopago: any;
Mercadopago.setPublishableKey('TEST-8941ded4-e7bf-46f3-86f3-1aa854b41648');

export class CreditCard extends React.Component<any, any> {
    
    private doSubmit: boolean = true

    public getBin = (ccNumber: string) => {
        return ccNumber.replace(/[ .-]/g, '').slice(0, 6);
    }

    private guessingPaymentMethod = (event: any) => {
        let bin = this.getBin(event.target.value);
        if (bin.length >= 6) {
            Mercadopago.getPaymentMethod({
                "bin": bin
            }, this.setPaymentMethodInfo);
        }
    }

    private setPaymentMethodInfo = (status: number, response: any) => {
        if (status == 200) {
            // do somethings ex: show logo of the payment method
            console.log(response)
            // do somethings ex: show logo of the payment method
            let $form = document.querySelector('#pay');
            let paymentMethodId:any = document.querySelector("input[name=paymentMethodId]");

            if (paymentMethodId == null) {
                let paymentMethod = document.createElement('input');
                paymentMethod.setAttribute('name', "paymentMethodId");
                paymentMethod.setAttribute('type', "hidden");
                paymentMethod.setAttribute('value', response[0].id);
                $form.appendChild(paymentMethod);
            } else {
                paymentMethodId.value = response[0].id;
            }
        }
    }

    private doPay = (event: any) => {
        event.preventDefault();
        if (!this.doSubmit) {
            var $form = document.querySelector('#pay');
            Mercadopago.createToken($form, this.sdkResponseHandler);
            return false;
        }
    }

    private sdkResponseHandler = (status: number, response: any) => {
        if (status != 200 && status != 201) {
            alert("verify filled data");
        } else {
            let form = document.querySelector('#pay');
            let card = document.createElement('input');
            card.setAttribute('name', "token");
            card.setAttribute('type', "hidden");
            card.setAttribute('value', response.id);
            form.appendChild(card);
            this.doSubmit = true;
        }
    }

    public render() {
        return (
            <div>
                <h1>MP custom checkout</h1>
                <form action="" method="post" id="pay" name="pay">
                    <fieldset>
                        <ul>
                            <li>
                                <label htmlFor="cardNumber">Credit card number:</label>
                                <input type="text" id="cardNumber" data-checkout="cardNumber" placeholder="4509 9535 6623 3704" onChange={this.guessingPaymentMethod} />
                            </li>
                            <li>
                                <label htmlFor="securityCode">Security code:</label>
                                <input type="text" id="securityCode" data-checkout="securityCode" placeholder="123" />
                            </li>
                            <li>
                                <label htmlFor="cardExpirationMonth">Expiration month:</label>
                                <input type="text" id="cardExpirationMonth" data-checkout="cardExpirationMonth" placeholder="12" />
                            </li>
                            <li>
                                <label htmlFor="cardExpirationYear">Expiration year:</label>
                                <input type="text" id="cardExpirationYear" data-checkout="cardExpirationYear" placeholder="2015" />
                            </li>
                            <li>
                                <label htmlFor="cardholderName">Card holder name:</label>
                                <input type="text" id="cardholderName" data-checkout="cardholderName" placeholder="APRO" />
                            </li>
                            <li>
                                <label htmlFor="docType">Document type:</label>
                                <select id="docType" data-checkout="docType"></select>
                            </li>
                            <li>
                                <label htmlFor="docNumber">Document number:</label>
                                <input type="text" id="docNumber" data-checkout="docNumber" placeholder="12345678" />
                            </li>
                        </ul>
                        <input type="submit" value="Pay!" />
                    </fieldset>
                </form>
            </div>
        )
    }

};