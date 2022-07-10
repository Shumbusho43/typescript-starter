import express,{Request,Response} from 'express'
import { PrismaClient } from '@prisma/client'
const app = express()
app.use(express.json())
const prisma = new PrismaClient();
//4 http methods: GET, POST, PUT, DELETE
app.get("/",async (req:Request,res:Response)=>{
    const user=await prisma.users.findMany({
        include:{
            car:true
        }
    });
    return res.send(user);
}
)
app.post("/",async (req:Request,res:Response)=>{
    // console.log("working");
    const {username,password} =req.body;
    //finding is username exist
    const userExists=await prisma.users.findFirst({
        where:{
            username:username
        }
    });
    if(userExists){
        return res.send("username already exist");
    }
    //creating new user
    const user = await prisma.users.create({
        data:{
            username,
            password
        }
    })
    return res.status(200).send("user inserted")
}
)
app.put("/",async (req:Request,res:Response)=>{
   const {username,id}=req.body;
   const userExists=await prisma.users.findFirst({
         where:{
                id:Number(id)
            }
    });
    if(!userExists){
        return res.send("No user found");
    }
    else{
   const user=await prisma.users.update({
    where:{
        id:id
    },
    data:{
        username
    }
   })
   return res.send(user)
}
}
)
app.delete("/:id",async (req:Request,res:Response)=>{
    const id=req.params.id;
    const userExists=await prisma.users.findFirst({
        where:{
            id:Number(id)
        }
    })
    if(!userExists){
        return res.status(404).send("user not found")
    }
    const user=await prisma.users.delete({
        where:{
          id:Number(id)
        }
    });
    if(user){
        return res.send("user deleted")
    }
}
)
app.get("/:id",async(req:Request,res:Response)=>{
    const id=req.params.id;
    const user=await prisma.users.findUnique({
        where:{
            id:Number(id)
        }
    })
    if(!user){
        return res.status(404).send("user not found")
    }
    return res.send(user)
})
app.post("/createManyCars",async(req:Request,res:Response)=>{
const {listOfCars} = req.body;
const cars=await prisma.car.createMany({
    data:listOfCars
});
return res.status(201).send("cars created")
})
app.listen(3000, () => {
    console.log('listening on port 3000')
    }

)