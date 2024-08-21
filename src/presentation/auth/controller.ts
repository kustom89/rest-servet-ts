import { request, Response } from 'express';
import { CustomError, RegisterUserDto } from '../../domain';
import { AuthService } from '../services/auth.service';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';


export class AuthController {

    constructor(
        public readonly authService:AuthService
    ){}

    private handleError= (error:unknown, res:Response)=>{
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error:error.message})

        }
        console.log(`${error}`)
        return res.status(500).json({error:'Internal server error'})

    }

    registerUser=(req=request, res: Response)=>{
        const [error,registerDto] = RegisterUserDto.create(req.body)
        if(error) return res.status(400).json({error})

        this.authService.registerUser(registerDto!)
        .then((user)=>res.json(user))
        .catch(error=>this.handleError(error,res))

    }
    

    loginUser=(req=request, res: Response)=>{

        const [error,loginUserDto] = LoginUserDto.login(req.body)
        if(error) return res.status(400).json({error})

        this.authService.loginUser(loginUserDto!)
        .then((user)=>res.json(user))
        .catch(error=>this.handleError(error,res))
    }

    validateEmail=(req=request, res: Response)=>{
        const {token}=req.params;
        
        this.authService.validateEmail(token)
        .then(()=>res.json('email validated'))
        .catch(error=>this.handleError(error,res))


    }




}

