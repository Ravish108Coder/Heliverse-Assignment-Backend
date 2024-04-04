import {Router} from 'express'
import { Team } from '../models/team.model.js'

const router = Router()

router.post('/', async(req, res)=>{
    try{
        const {teams, teamName, description} = req.body
        const teamArray = []
        let newTeams = Array.from(teams)
        newTeams.forEach(team=>{
            teamArray.push(team)
        })
        const newTeam = new Team({
            name: teamName,
            members: teamArray,
            description: description
        })
        await newTeam.save()
        res.status(201).json({message: 'Teams created successfully!'})
    }catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})

router.get('/', async(req, res)=>{
    try{
        const allTeams = await Team.find()
        res.status(200).json({message: 'Teams fetched successfully!', data: allTeams})
    }catch(error){
        console.log(error.message)
        res.status(500).json({message: error.message})
    }
})

router.get('/:id', async(req, res)=>{
    try {
        const {id} = req.params
        const team = await Team.findOne({_id: id})
        console.log(team)
        if(!team){
            return res.status(404).json({message: 'Team not found'})
        }
        return res.status(200).json({message: 'Team fetched successfully', data: team})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})

export default router;