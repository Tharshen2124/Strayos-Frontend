import { apiKey, apiUrl, mapId } from '@/src/utils/env';
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import AddStrayPetDialog from '@/src/components/AddPetStrayDialog';
import { Straypet } from '@/src/types/straypets';
import useAuthStore from '../store/useAuthStore';
import { useRouter } from 'next/router';
import { NavigationBar } from '../components/NavigationBar';
import { getTimeDifference } from '../utils/getTimeDifference';
import MoreInfoDialog from '../components/MoreInfoPetDialog';
import { Spinner } from '../components/LoadingSpinner';
import { useToast } from '../hooks/use-toast';

export default function Main() {
  const { token } = useAuthStore.getState();
  const [data, setData] = useState<Straypet[]>();
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOnClient, setIsOnClient] = useState(true)
  const router = useRouter();
  const { toast } = useToast()
  
  useEffect(() => {
    if (isOnClient) {
      setIsOnClient(false)
      return
    }

    if (token && token === 'No Value') {
      router.push('/login');
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setIsLoading(false); // Stop loading once location is set
        },
        (err) => {
          setErrorMessage("Error getting location. Please enable location services.");
          console.error(err);
          toast({
            title: "Please enable your location to use our service.",
            variant: "destructive",
          })
          setIsLoading(false); // Stop loading if location fails
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
      setIsLoading(false); // Stop loading if geolocation is unsupported
    }

    async function getData() {
      try {
        const response = await axios.get(`${apiUrl}/stray-pets`, {
          headers: {
            'Accept': "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        setData(response.data.data);
      } catch (error) {
        console.error("Error occurred", error);
        toast({
          title: "Uh Oh! An error occured.",
          variant: "destructive",
        })
      }
    }

    toast

    getData()
  }, [token, isOnClient])

  if (isLoading) {
    return <Spinner />
  }

  if(!isLoading && errorMessage) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <h1 className="text-center text-lg font-semibold dark:text-[#e0e0e0]">
          An error occurred, please try again
        </h1>
      </div>
    )
  }

  return (
    <>
     <NavigationBar/>
     <div className="h-[100vh] w-[100%]">
      <APIProvider apiKey={apiKey} onLoad={() => console.log('Maps API has loaded.')}>
        <Map
          defaultZoom={13}
          defaultCenter={{ lat: latitude, lng: longitude }}
          mapId={mapId}
          mapTypeControl={false}
          fullscreenControl={false}
          disableDefaultUI={true}
        >
          {data && data.map((strayPet: Straypet, index) => {
            return (
              <MoreInfoDialog strayPet={strayPet} key={index}>
                <AdvancedMarker  position={{lat: Number(strayPet.Latitude), lng: Number(strayPet.Longitude)}}>
                <Image className="rounded-[100px] border-4 border-white dark:border-black" src={strayPet.ImageURL} alt="cat image" width="60" height="60"/>
                  <div className="text-center font-bold text-md bg-white dark:bg-black dark:text-white rounded-xl py-1 px-2 mt-[-5px]">{getTimeDifference(strayPet.CreatedAt)}</div>
                </AdvancedMarker>
              </MoreInfoDialog>
            )
          })}
        </Map>
      </APIProvider>
      <AddStrayPetDialog latitude={latitude} longitude={longitude}/>
    </div>
    </>
  );
}

