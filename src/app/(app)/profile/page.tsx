'use client';
import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Mail, Shield, Key, Edit, BadgeCheck } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/AuthProvider';
import { getCurrentUserProfile, updateUserProfile } from '@/lib/auth';

interface UserData {
    displayName: string;
    email: string;
    emailVerified: boolean,
    photoURL: string,
    createdAt: string,
    lastLoginAt: string,
}

const ProfilePage: React.FC = () => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const { register, handleSubmit, reset } = useForm<UserData>();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userProfile = getCurrentUserProfile();
                reset({
                    displayName: userProfile.displayName,
                    email: userProfile.email,
                    photoURL: userProfile.photoURL,
                    emailVerified: userProfile.emailVerified,
                    createdAt: userProfile.createdAt,
                    lastLoginAt: userProfile.lastLoginAt,
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchUserProfile();
    }, [reset]);

    const onSubmit: SubmitHandler<UserData> = async (data) => {
        const user = auth.currentUser;
        if (user) {
            try {
                await updateUserProfile({
                    displayName: data.displayName,
                    photoURL: data.photoURL,
                });
                setShowAlert(true);
                setError(null);
                setTimeout(() => setShowAlert(false), 3000);
                setIsDialogOpen(false);
            } catch (error) {
                console.error("Error updating profile:", error);
                setError("Failed to update profile. Please try again.");
            }
        }
    };
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <div className="max-w-5xl mx-auto p-4">
                    {showAlert && (
                        <Alert className="mb-4 bg-green-50 dark:bg-green-900">
                            <AlertDescription>
                                Profile updated successfully!
                            </AlertDescription>
                        </Alert>
                    )}
                    {error && (
                        <Alert className="mb-4 bg-red-50 dark:bg-red-900">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="mb-4">
                        <h2 className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                            <Link href="/" className="hover:underline">Home</Link> &gt; Profile
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Profile Overview Card */}
                        <Card className="bg-white dark:bg-[#1c1d1f]">
                            <CardHeader className="text-center pb-4">
                                <div className="flex justify-end mb-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsDialogOpen(true)}
                                        className="absolute"
                                        aria-label="Edit Profile"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </Button>
                                </div>
                                <div className="relative w-32 h-32 mx-auto mb-4">
                                    <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <Avatar className="cursor-pointer no-focus-outline no-select w-full h-full">
                                            <AvatarImage
                                                src={user?.photoURL || "https://github.com/k.png"}
                                                alt="user avatar"
                                            />
                                            <AvatarFallback>
                                                {user?.displayName?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="absolute bottom-0 right-0 rounded-full"
                                    >
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-xl font-semibold">{user?.displayName}</CardTitle>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.metadata?.creationTime}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 pt-4 border-t">
                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">{user?.email}</span>
                                        <span>{user?.emailVerified ? (<div><BadgeCheck /></div>) : "email not verifie"}</span>
                                    </div>
                                    {/* <div className="flex items-center space-x-3">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">{formData.phoneNumber}</span>
                                    </div> */}
                                    {/* <div className="flex items-center space-x-3">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">{formData.address}</span>
                                    </div> */}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Edit Profile Dialog */}
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="displayName">Display Name</Label>
                                            <Input
                                                id="displayName"
                                                {...register("displayName")}
                                            />
                                        </div>
                                        {/* <div className="space-y-2">
                                            <Label htmlFor="photoURL">Photo URL</Label>
                                            <Input
                                                id="photoURL"
                                                {...register("photoURL")}
                                            />
                                        </div> */}
                                        {/* <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                disabled={true}
                                            />
                                        </div> */}
                                        {/* <div className="space-y-2">
                                            <Label htmlFor="phoneNumber">Phone Number</Label>
                                            <Input
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                            />
                                        </div> */}
                                        {/* <div className="space-y-2">
                                            <Label htmlFor="address">Address</Label>
                                            <Input
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            />
                                        </div> */}
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsDialogOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                        {/* Security Card */}
                        <Card className="bg-white dark:bg-[#1c1d1f]">
                            <CardHeader className="pb-6">
                                <div className="flex items-center space-x-2">
                                    <Shield className="h-5 w-5 text-gray-500" />
                                    <CardTitle className="text-xl font-semibold">Security Settings</CardTitle>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Manage your account security and authentication methods
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <Key className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">Password</h3>
                                            </div>
                                        </div>
                                        <Link href={"/change-password"}><Button>Change</Button></Link>
                                    </div>
                                    {/* <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <Shield className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <h3 className="font-medium">Two-Factor Authentication</h3>
                                                <p className="text-sm text-gray-500">Not enabled</p>
                                            </div>
                                        </div>
                                        <Button>Enable</Button>
                                    </div> */}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProfilePage;

