const stripe = require('../../config/stripe')

const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

async function getLineItems(lineItems){
    
}

const webhooks = async (request,response) => {
    const sig = request.headers['stripe-signature'];

    const payloadString = JSON.stringify(request.body)

    const header = stripe.webhooks.generateTestHeaderString({
        payload : payloadString,
        secret : endpointSecret,
    });

    let event;

    try {
        event = stripe.webhooks.constructEvent(payloadString, header, endpointSecret);

    } catch (err) {
        response.status(400).send(`webhook Error: ${err.message}`);
        return;
    }

    //handle the event 
    switch (event.type){
        case 'checkout.session.completed':
            const session = event.data.object;

            
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

            console.log("lineItems",lineItems)
            console.log("totalAmount",session.amount_total/100)

            break;
            //handle other event types
            default:
                console.log(`unhandled event type ${event.type}`);
    }


    response.status(200).send();
}

module.exports = webhooks;