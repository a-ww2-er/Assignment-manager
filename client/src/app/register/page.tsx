"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const faculties = [
  { id: "applied-science", name: "Faculty of Applied Science" },
  { id: "social-science", name: "Faculty of Social Science" },
  { id: "management-science", name: "Faculty of Management Science" },
];

const departments = {
  "applied-science": [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biochemistry",
    "Microbiology",
    "Geology",
    "Statistics",
    "Environmental Science",
    "Industrial Chemistry",
  ],
  "social-science": [
    "Economics",
    "Political Science",
    "Sociology",
    "Psychology",
    "Mass Communication",
    "Geography",
    "Anthropology",
    "Social Work",
    "International Relations",
    "Public Administration",
  ],
  "management-science": [
    "Accounting",
    "Business Administration",
    "Banking and Finance",
    "Marketing",
    "Entrepreneurship",
    "Human Resource Management",
    "Public Administration",
    "Management Information Systems",
    "Insurance",
    "Actuarial Science",
  ],
};

const levels = ["100", "200", "300", "400", "500"];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    matricNumber: "",
    password: "",
    firstName: "",
    lastName: "",
    otherNames: "",
    email: "",
    faculty: "",
    department: "",
    level: "",
  });
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string); // Store base64 string
        setImagePreview(reader.result as string); // Set image preview
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare the data to send
      const dataToSend = {
        ...formData,
        profileImage: profileImage, // Include base64 image
      };

      // Debugging: Log the data being sent
      console.log("Data to send:", dataToSend);

      // Send the data to the backend as JSON
      const response = await axios.post(
        "https://assignment-manager-gefc.onrender.com/api/auth/register",
        dataToSend,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast(response?.data?.message);
      console.log("Registration successful:", response.data);
      // Handle successful registration (e.g., redirect to login page)
    } catch (error) {
      const errorData: any = error;
      toast(`Error ${errorData?.response?.message || errorData?.message}`);

      console.error("Registration failed:", error);
      // Handle registration error (e.g., show error message to user)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center justify-center">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pngwing.com%20(4)-15BtszmYBTV6lyTPmnqeCqslMtWz50.png"
        alt="NSUK Logo"
        width={100}
        height={100}
        className="mb-4"
      />
      <h1 className="text-2xl font-bold text-secondary mb-6">
        NSUK Assignment Manager Registration
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profileImage">Profile Image</Label>
          <div className="flex items-center flex-col justify-center space-x-4">
            {imagePreview && (
              <Image
                src={imagePreview || "/placeholder.svg"}
                alt="Profile Preview"
                width={640}
                height={480}
                className="rounded-[50%] w-52 h-52 mb-4 object-cover"
              />
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <Input
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              ref={fileInputRef}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="matricNumber">Matric Number</Label>
          <Input
            id="matricNumber"
            name="matricNumber"
            value={formData.matricNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="otherNames">Other Names</Label>
          <Input
            id="otherNames"
            name="otherNames"
            value={formData.otherNames}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="faculty">Faculty</Label>
          <Select
            onValueChange={(value) => handleSelectChange("faculty", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Faculty" />
            </SelectTrigger>
            <SelectContent>
              {faculties.map((faculty) => (
                <SelectItem key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select
            onValueChange={(value) => handleSelectChange("department", value)}
            disabled={!formData.faculty}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {formData.faculty &&
                departments[formData.faculty as keyof typeof departments].map(
                  (dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  )
                )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select onValueChange={(value) => handleSelectChange("level", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </div>
  );
}
