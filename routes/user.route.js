import {Router} from 'express'
import { User } from '../models/user.model.js'

const router = Router()

router.get('/', async (req, res) => {
    try {
        // Extracting page, limit, domain, gender, availability, and searchName from query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const domain = req.query.domain || '';
        const gender = req.query.gender || '';
        const available = req.query.available || '';
        const searchName = req.query.searchName || '';

        // Prepare the filter object based on provided criteria
        const filter = {};
        if (domain !== '') {
            filter.domain = domain;
        }
        if (gender !== '') {
            filter.gender = gender;
        }
        if (available !== '') {
            filter.available = available === 'true'; // Convert string to boolean
        }
        if (searchName !== '') {
            // Split searchName into separate terms
            const searchTerms = searchName.split(' ');
        
            // Prepare an array to store individual search conditions
            const searchConditions = [];
        
            // For each search term, create a condition to match first name or last name
            searchTerms.forEach(term => {
                searchConditions.push(
                    { first_name: { $regex: term, $options: 'i' } }, // Match first name containing the term
                    { last_name: { $regex: term, $options: 'i' } }   // Match last name containing the term
                );
            });
        
            // Combine individual search conditions using $or operator
            filter.$or = searchConditions;
        }
        

        // Calculate the offset based on page and limit
        const offset = (page - 1) * limit;

        // Fetch users with pagination and filtering
        const allUsers = await User.find(filter)
            .skip(offset) // Skip records based on the offset
            .limit(limit); // Limit the number of records returned
        
        // Count total documents matching the filter
        const total = await User.countDocuments(filter);

        return res.status(200).json({
            message: 'Users fetched successfully!',
            data: allUsers,
            page: page,
            limit: limit,
            total: total // Total count of documents matching the filter
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get user by id
router.get('/:id', async(req, res)=>{
    try {
        const {id} = req.params
        const user = await User.findOne({_id: String(id)})
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        return res.status(200).json({message: 'User fetched successfully', data: user})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})

// update user
router.put('/:id', async(req, res)=>{
    try {
        const {id} = req.params
        const {first_name, last_name, email, domain, gender, available} = req.body
        const availability = available === 'True' ? true : false
        const user = await User.findById({id: Number(id)})
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.domain = domain
        user.available = availability
        await user.save()
        return res.status(200).json({message: 'User Updated Successfully', user: user})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})

// create user
router.post('/', async(req, res)=>{
    try {
        console.log(req.body)
        const {id, first_name, last_name, email, gender, avatar, domain, available} = req.body
        const availability = available === 'True' ? true : false

        const docs = await User.find({email})
        if(docs.length > 0){
            return res.status(400).json({message: 'User already exists with this email'})
        }
        const user = new User({
            id, first_name, last_name, email, gender, avatar, domain, available: availability
        })

        await user.save()

        return res.status(201).json({message: 'User Created Successfully', user: user})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})

// delete user
router.delete('/:id', async(req, res)=>{
    try {
        const {id} = req.params
        const user = await User.findOne({_id: String(id)})
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        await User.deleteOne({_id: String(id)});
        return res.status(200).json({message: 'User Deleted Successfully'})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message: error.message})
    }
})

export default router;