import express from 'express';
import { PrismaClient } from '@prisma/client';
import { startSession } from './src/utils/initWpp.js';
import { sendMsgWpp } from './src/utils/sendMsg.js';

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await startSession();


app.post('/addclient', async (req, res) => {

    const {level, name, wpp} = req.body;

    try {

        const client = await prisma.client.create({
    
            data: {
    
                level,
                name,
                wpp
    
            }
    
        });
        res.json("cliente adicionado com sucesso " +client);

    } catch (error) {
        console.log("erro ao adicionar cliente. " + error);
    }


});

app.post('/addsell', async(req, res) =>{

    let {client_id, value} = req.body;
    client_id = parseInt(client_id);
    value = parseFloat(value);
    const today = new Date();
    const date_pay = new Date(today.getFullYear(), today.getMonth()+1, 1);

    try {
        
        const sell = await prisma.bought.create({

            data:{

                date_pay,
                client_id,
                value
            }

        })

        console.log("venda adicionada com sucesso " + sell);

        recordDebit(client_id, value);

        const number = await findNumber(client_id);
        const mensagem = `Olá, esta é uma mensagem automática. Você acaba de fazer uma compra! O valor da compra foi de R$ ${value}. Obrigado!`;
        
        await sendMsgWpp(number, mensagem);

        res.json({sell});


    } catch (error) {
        console.log("erro ao adicionar venda. " + error);
    }


})

async function findNumber(client_id) {

    try {
        
        const client = await prisma.client.findUnique({

            where: {
                id: client_id
            }

        });

        return client.wpp;

    } catch (error) {
        console.log("erro ao buscar número. " + error);
    }
    
}

async function recordDebit (client_id, value) {

    try {
        
        const client = await prisma.client.findUnique({

            where: {
                id: client_id
            }

        });

        const debit = client.debit + value;

        const clientUpdate = await prisma.client.update({

            where: {
                id: client_id
            },
            data: {
                debit
            }

        });

        console.log("débito registrado com sucesso " + clientUpdate);

    } catch (error) {
        console.log("erro ao registrar débito. " + error);
    }

}

app.listen(PORT, ()=>{

    console.log(`Server running on port ${PORT}`);

});
