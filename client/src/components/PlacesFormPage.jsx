import { useEffect, useState } from "react";
import PhotosUploader from "./PhotosUploader";
import Perks from "./Perks";
import AccountNav from "./AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function PlacesFormPage() {
  const { id } = useParams();
  // console.log({ id });
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setExtraInfo(data.extraInfo);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(e) {
    e.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    if (id) {
      //update
      await axios.put("/places", {
        id,
        ...placeData,
      });
      setRedirect(true);
    } else {
      //newPlace
      await axios.post("/places", placeData);
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <div>
      <AccountNav />
      <div>
        <form onSubmit={savePlace}>
          {preInput(
            "Title",
            "Titles for your place should be short and catchy"
          )}
          {/* I have commented down and put a number to understand the steps that I took from beginning */}
          {/* 2. {inputHeader("Title")}
            {inputDescription(
              "Titles for your place should be short and catchy"
            )} */}
          {/*1. <p className='text-gray-500 text-sm'>Titles for your place should be short and catchy</p> */}
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="title for example: my lovely appartment"
          />
          {preInput("Address", "Residence address")}
          {/* {inputHeader("Address")}
            {inputDescription("Residence address")} */}
          {/* <p className='text-gray-500 text-sm'>Residence address</p> */}
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address of the appratment"
          />
          {preInput("Photos", "min 5 pics for better engagement")}
          <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
          {/* {inputHeader("Photos")}
            {inputDescription("min 5 pics for better engagement")} */}
          {/* <p className='text-gray-500 text-sm'>min 5 pics for better engagement</p> */}
          {/* <div className="flex gap-2">
              <input
                className=""
                type="text"
                value={photoLink}
                onChange={(e) => setPhotoLink(e.target.value)}
                placeholder="Add using a link"
              />
              <button
                onClick={addPhotoByLink}
                className="bg-primary text-white px-4 py-2 rounded-xl"
              >
                Add&nbsp;photo
              </button>
            </div>
            <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              <label className="cursor-pointer flex h-60 w-80 items-center gap-1 justify-center border bg-slate-100 px-2 rounded-2xl text-2xl text-gray-600 hover:bg-slate-200">
                Upload
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={uploadPhoto}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                  />
                </svg>
              </label> */}
          {/* {addedPhotos.length > 0 &&
              addedPhotos.map((link, index) => (
                <div key={link}>
                  {
                    <img
                      // key={index}
                      src={"http://localhost:1337/upload/" + link}
                      className="rounded-3xl px-3 h-60 w-full object-cover"
                    />
                  }
                  {console.log("http://localhost:1337/upload" + link)}
                </div>
              ))} */}
          {/* </div> */}
          {preInput(
            "Description",
            "Write a full descriptiion about the residence"
          )}
          {/* {inputHeader("Description")}
            {inputDescription("Write a full descriptiion about the residence")} */}
          {/* <p className='text-gray-500 text-sm'>Write a full descriptiion about the residence</p> */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {preInput("Perks", "Select all the perks of this place")}
          <Perks selected={perks} onChange={setPerks} />
          {preInput("Extra Information", "house rules, etc...")}
          {/* {inputHeader("Extra Information")}
          {inputDescription("house rules, etc...")} */}
          {/* <p className='text-gray-500 text-sm'>house rules, etc...</p> */}
          <textarea
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
          />
          {preInput(
            "Check in & out times",
            "add check in and out times, remember to have sometime in between each guests"
          )}
          {/* {inputHeader("Check in & out times")}
          {inputDescription(
            "add check in and out times, remember to have sometime in between each guests"
          )} */}
          {/* <h2 className='text-xl mt-4'>Check in & out times</h2>
            <p className='text-gray-500 text-sm'>add check in and out times, remember to have sometime in between each guests</p> */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 ">
            <div className="-mt-1">
              <h3>check in time</h3>
              <input
                type="text"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                placeholder="14"
              />
            </div>
            <div className="-mt-1">
              <h3>check out time</h3>
              <input
                type="text"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                placeholder="16"
              />
            </div>
            <div className="-mt-1">
              <h3>Max number of guests</h3>
              <input
                type="number"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
                // placeholder="11"
              />
            </div>
            <div className="-mt-1">
              <h3>Price</h3>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                // placeholder="11"
              />
            </div>
          </div>
          <div>
            <button className="primary-btn my-4">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
