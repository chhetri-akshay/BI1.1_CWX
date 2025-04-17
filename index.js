const express = require("express")
const app = express()
const { initializeDatabase } = require("./db/db.connect")
const Restaurant = require("./models/restaurant.models")
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json())
initializeDatabase()

    async function createNewRestaurant(newRestaurant){
        try{
            const restaurant = new Restaurant(newRestaurant)
            const saveRestaurant = await restaurant.save()
            return saveRestaurant
        } catch(error) {
            throw(error)
        }
    }
    
    app.post("/restaurants", async (req, res) => {
        try{
            const savedRestaurant = await createNewRestaurant(req.body)
            res.status(201).json({message: "New restaurant saved successfully.", restaurant: savedRestaurant})
        }catch(error){
            res.status(500).json({error: "An error occured while fetching data."}) 
        }
    })
    
      async function readAllData(){
        try{
            const allRestaurant = await Restaurant.find()
            return allRestaurant
    
        } catch (error) {
            throw(error)
        }
      }
    
      app.get("/restaurants", async (req, res) => {
        try{
            const restaurants = await readAllData()
            if(restaurants.length != 0) {
                res.json(restaurants)
            } else {
                res.status(404).json({error: "No restaurant found."})
            }
        } catch(error) {
            res.status(500).json({error: "Failed to fetch restaurants"})
        }
      })
    
      async function readByName(restaurantName) {
        try {
            const selectedRestaurant = await Restaurant.findOne({name: restaurantName})
            return selectedRestaurant
        } catch (error) {
            throw(error)
        }
      }
    
      app.get("/restaurants/:name",  async(req,res) => {
        try{
            const restaurant = await readByName(req.params.name)
            if(restaurant) {
                res.json(restaurant)
            } else {
                res.status(404).json({error: "Restaurant not found."})
            }
    
        } catch(error) {
            res.status(500).json({error: "Failed to fetch restaurant."})
        }
      })
    
    async function readByNumber(number) {
        try{
            const restraundByNo = await Restaurant.findOne({phoneNumber: number})
            return restraundByNo
        } catch (error) {
            throw(error)
        }
    }
    
    app.get("/restaurants/directory/:phoneNumber", async (req, res) => {
        try{
            const restaurant = await readByNumber(req.params.phoneNumber)
            if(restaurant) {
                res.json(restaurant)
            } else{
                res.status(404).json({error: "Restaurant not found."})
            }
        } catch(error) {
            res.status(500).json({error: "Failed to fetch phone number."})
        }
    })
    
    async function restaurantByCuisine(selectedCuisine) {
        try{
            const selectedRestaurant = await Restaurant.find({cuisine: selectedCuisine})
            return selectedRestaurant
        } catch(error) {
            throw(error)
        }
    }
    
    app.get("/restaurants/cuisine/:cuisineName", async(req, res) => {
        try{
            const restaurant = await restaurantByCuisine(req.params.cuisineName)
            if(restaurant) {
                res.json(restaurant)
            } else {
                res.status(404).json({error: "Restaurant not found."})
            }
        } catch(error) {
            res.status(500).json({error: "Failed to fetch cuisine."})
        }
    })
    
    async function restaurantByLocation(selectedLocation) {
        try{
            const selectedRestaurant = await Restaurant.find({location: selectedLocation})
            return selectedRestaurant
        } catch(error) {
            throw(error)
        }
    }
    
    app.get("/restaurants/location/:restaurantLocation", async(req, res) => {
        try{
            const restaurant = await restaurantByLocation(req.params.restaurantLocation)
            if(restaurant) {
                res.json(restaurant)
            }else {
                res.status(404).json({error: "Restaurant not found"})
            }
        } catch(error) {
            res.status(500).json({error: "Failed to fetch location."})
        }
    })

    async function deleteRestaurant(restrauntId){
        try{
            const deleteRestaurant = await Restaurant.findByIdAndDelete(restrauntId)
            return deleteRestaurant
        }catch(error) {
            throw(error)
        }
    }

    app.delete("/restaurants/:restaurantId", async (req, res) => {
        try{
            const deletedRestaurant = await deleteRestaurant(req.params.restaurantId)
            if(deletedRestaurant){
                res.status(201).json({message: "Restaurant deleted successfully."})
            }else {
                res.status(404).json({error: "Restaurant not found."})
            }
        }catch {
            res.status(500).json({error: "Restaurant fetching failed."})
        }
    })

    async function updateRestaurant(restaurantId, dataToUpdate){
        const updateRestaurant = await Restaurant.findByIdAndUpdate(restaurantId, dataToUpdate, {new: true})
        return updateRestaurant
    }

    app.post("/restaurant/:restaurantId", async (req, res) => {
        try{
            const updatedRestaurant = await updateRestaurant(req.params.restaurantId, req.body)
            if(updateRestaurant){
                res.status(201).json({message: "Restaurant updated successfully", updatedRestaurant: updatedRestaurant})
            }else {
                res.status(404).json({message: "Restaurant not found"})
            }
        }catch(error) {
            throw(error)
        }
    })
    
    const PORT = 9010
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`)
    })
    



