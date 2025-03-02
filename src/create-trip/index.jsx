import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { AI_PROMPT, travelBudget, travelList } from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/service/AIMODAL";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    if (name === "noOfDays" && value >= 7) {
      toast("Trip duration must be less than 7 days.");
      return;
    }
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp.access_token),
    onError: (error) => console.log(error),
  });

  const saveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();

    try {
      const parsedTripData = JSON.parse(TripData);
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: parsedTripData,
        userEmail: user?.email,
        id: docId,
      });
      setLoading(false);
      navigate("/view-trip/" + docId);
    } catch (error) {
      console.error("Failed to save trip:", error);
      toast("Failed to save trip. Please try again.");
      setLoading(false);
    }
  };

  const onGenerateTrip = async () => {
    const user = localStorage.getItem("user");

    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (
      !formData?.location?.label ||
      !formData?.noOfDays ||
      !formData?.noOfPeople ||
      !formData?.budget
    ) {
      toast("Please fill all the details");
      return;
    }

    toast("Generating trip...");
    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData?.location?.label
    )
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{noOfPeople}", formData?.noOfPeople)
      .replace("{budget}", formData?.budget);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = await result?.response?.text();
      console.log("AI Response Text:", responseText);
      saveAiTrip(responseText);
    } catch (error) {
      console.error("Failed to generate trip:", error);
      toast("Failed to generate trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const GetUserProfile = async (access_token) => {
    try {
      const resp = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: "Application/json",
          },
        }
      );
      console.log("User Info:", resp.data);
      localStorage.setItem("user", JSON.stringify(resp.data));
      setOpenDialog(false);
      onGenerateTrip();
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      toast("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 mt-10">
      <h2 className="font-semibold text-3xl">
        Tell us Your Travel Preference ⛺
      </h2>
      <p className="mt-5 text-[#32a86b] text-xl">
        Provide some basic information and our trip planner will generate an
        Itinerary📃
      </p>
      <div>
        <div className="mt-9 gap-10">
          <h2 className="text-xl font-medium">
            What is the destination of your trip?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              onChange: (v) => handleInputChange("location", v),
              placeholder: "Search for a location...",
            }}
          />
        </div>
        <div>
          <h2 className=" mt-5 text-xl font-medium">
            What is the duration of your trip?
          </h2>
          <Input
            type="number"
            placeholder={"Ex.3 or 4"}
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>
      </div>
      <div>
        <h2 className="text-xl my-3 font-medium">
          What is the budget of your trip?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-5">
          {travelBudget.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-3 border rounded-lg hover:shadow cursor-pointer ${
                formData?.budget == item.title && "border-black"
              }`}
            >
              <h2>{item.icon}</h2>
              <h2 className="font-bold">{item.title}</h2>
              <h2 className="text-sm text-gray-400">{item.desc}</h2>
            </div>
          ))}
        </div>
        <h2 className="text-xl my-3 font-medium">
          Number of People Travelling
        </h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {travelList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("noOfPeople", item.people)}
              className={`p-4 border rounded-lg hover:shadow cursor-pointer ${
                formData?.noOfPeople == item.people && "border-black"
              }`}
            >
              <h2>{item.icon}</h2>
              <h2 className="font-bold">{item.title}</h2>
              <h2 className="text-sm text-gray-400">{item.desc}</h2>
              <h2 className="text-sm text-gray-400">{item.people}</h2>
            </div>
          ))}
        </div>
      </div>
      <div className="my-10 justify-end flex">
        <Button disabled={loading} onClick={onGenerateTrip}>
          {loading ? (
            <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
          ) : (
            "Generate Trip"
          )}
        </Button>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src="/logo.svg"
                  alt="Logo"
                  style={{ marginRight: "10px" }}
                />
                <h2 className="text-lg font-bold">aTrip</h2>
              </div>
              <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
              <p>Sign in to the App with Google authentication securely</p>
              <Button
                className="w-full mt-5 flex gap-4 items-center"
                onClick={login}
              >
                <FcGoogle className="h-7 w-7" />
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
