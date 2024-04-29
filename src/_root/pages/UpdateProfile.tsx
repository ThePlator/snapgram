import Loader from "@/components/shared/Loader";
import ProfileUploader from "@/components/shared/ProfileUploader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById, useUpdateUser } from "@/lib/react-queries/queriesAndMutations";
import { ProfileValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const UpdateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, setUser } = useUserContext();
  const memoizedUser = useMemo(() => user, [user.username]);

  const { data: currentUser } = useGetUserById(id || "");
  const { mutateAsync: updateMutate, isPending: isLoadingUpdate } = useUpdateUser();

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      username: "",
      name: "",
      bio: "",
      file: [],
      email: "",
    },
  });

  useEffect(() => {
    form.setValue("username", user.username);
    form.setValue("email", user.email);
    form.setValue("name", user.name);
    form.setValue("bio", user.bio || "");
  }, [memoizedUser]);

  if (!currentUser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const handleUpdate = async (values: z.infer<typeof ProfileValidation>) => {
    const updatedUser = await updateMutate({
      userId: currentUser.$id,
      name: values.name,
      bio: values.bio,
      file: values.file,
      imageId: currentUser.imageId,
      imageUrl: currentUser.imageUrl,
    });

    if (!updatedUser) {
      toast({
        title: "Update user failed. Please try again",
      });
    }

    setUser({
      ...user,
      name: updatedUser?.name,
      bio: updatedUser?.bio,
      imageUrl: updatedUser?.imageUrl,
    });

    return navigate(`/profile/${id}`);
  };

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            className="invert-white"
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="Edit image"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>

        <Form {...form}>
          <form
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl"
            onSubmit={form.handleSubmit(handleUpdate)}
          >
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader fieldChange={field.onChange} mediaUrl={currentUser.imageUrl} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Name</FormLabel>
                  <FormControl>
                    <Input className="shad-input" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input className="shad-input" type="text" disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input className="shad-input" type="email" disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
                  <FormControl>
                    <Textarea className="shad-textarea custom-scrollbar" {...field} />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <div className="flex gap-4 justify-end">
              <Link
                to={`/profile/${user.id}`}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 shad-button_dark_4 !h-auto"
              >
                Cancel
              </Link>
              <Button
                className="shad-button_primary whitespace-nowrap"
                type="submit"
                disabled={isLoadingUpdate}
              >
                {isLoadingUpdate ? <Loader /> : ""}
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
