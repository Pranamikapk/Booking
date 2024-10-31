import React from 'react'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import CardContent from '../../../components/ui/CardContent'

const placeTypeImages : Record<string,string> = {
    'Room': '/images/AddHotel/hotel.png',
    'Entire Place': '/images/AddHotel/home.png',
    'Shared Space': '/images/AddHotel/accomm_private_room@2x.png',
}


const PlaceType :React.FC <{formData : any ; handleChange: (data : any)=>void ; nextStep:()=>void ; prevStep: ()=>void}>= ({ formData , handleChange , nextStep , prevStep}) => {
    const placeType : string[] = ['Room','Entire Place','Shared Space']
    const handleClick = (type : string) =>{
        handleChange({ placeType : type })
        console.log(type);
        
        nextStep()
    }

  return (
    <>
        <h1 className="text-black text-4xl font-bold mb-5 text-center">
            What type of place will guests have?
        </h1>
        <div className="flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 mt-20">
                {placeType.map((type, index) => (
                    <Card key={index} className="max-w-xs">
                        <CardContent className="relative p-0 flex flex-col items-center">
                            <img
                                src={placeTypeImages[type]} 
                                alt={type}
                                width={20}
                                height={20}
                                className="w-24 h-24 object-cover rounded-t-lg"
                            />
                            <div className="p-4">
                                <h3 className="font-bold">{type}</h3>
                                <Button className="primary hover:bg-blue-700 text-white h-10 px-2" onClick={() => handleClick(type)}>
                                    List your Property
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </>
  )
}

export default PlaceType