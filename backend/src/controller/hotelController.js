import Hotel from "../models/hotelModel.js";

export const createHotel = async (req, res) => {
  try {
    const {
      propertyType,
      placeType,
      address,
      rooms,
      amenities,
      name,
      description,
      price,
      photos,
    } = req.body;

    console.log(req.body);

    const managerId = req.user?.id;

    if (!managerId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Manager ID not found" });
    }

    if (
      !propertyType ||
      !placeType ||
      !address ||
      !rooms ||
      !name ||
      !description ||
      !price ||
      !photos
    ) {
      console.log("Error: Missing required fields.");
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const hotelData = {
      manager: managerId,
      propertyType,
      placeType,
      address,
      rooms,
      amenities,
      name,
      description,
      photos,
      price,
    };

    console.log("Hotel data to be saved:", hotelData);

    const hotel = new Hotel(hotelData);
    await hotel.save();

    res.status(201).json(hotel);
  } catch (error) {
    console.log("Error::", error);
    res.status(500).json({ message: error.message });
  }
};

export const listHotels = async (req, res) => {
  const { managerId } = req.params;
  console.log("list:", managerId);

  try {
    const hotels = await Hotel.find({ manager: managerId });
    console.log(hotels);
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listHotelById = async (req, res) => {
  const { hotelId } = req.params;
  console.log("list:", hotelId);

  try {
    const hotels = await Hotel.findById(hotelId);
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const hotelDetails = async (req, res) => {
  const { hotelId } = req.params;

  try {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    console.log("hotel:", hotel);
    res.status(200).json(hotel);
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching hotel details" });
  }
};

export const listUnlistHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { status } = req.body;
    console.log(hotelId, status);

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(400);
      throw new Error("Hotel not found");
    }
    hotel.isListed = status;
    await hotel.save();

    res.status(200).json(hotel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateHotel = async (req, res) => {
  const { hotelId } = req.params;
  const managerId = req.user?.id;
  const updateData = req.body.updatedData;

  console.log("Received updateData:", updateData);

  try {
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    if (hotel.manager.toString() !== managerId) {
      return res
        .status(403)
        .json({
          message: "Unauthorized: Only the hotel owner can update this hotel",
        });
    }

    Object.keys(updateData).forEach((field) => {
      if (field in hotel) {
        hotel[field] = updateData[field];
      }
    });

    const updatedHotel = await hotel.save();
    console.log("Updated hotel:", updatedHotel);

    res.status(200).json(updatedHotel);
  } catch (error) {
    console.error("Error updating hotel:", error);
    res.status(500).json({ message: "Server error while updating hotel" });
  }
};

export const deleteHotel = async (req, res) => {
  const { hotelId } = req.params;
  console.log("HotelId:", hotelId);

  try {
    const hotel = await Hotel.findByIdAndDelete(hotelId);
    console.log("hotel:", hotel);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    res.status(500).json({ message: "Server error while deleting hotel" });
  }
};
