"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Form } from "@/components/ui/form";

import { messageSchema } from "@/app/schemas/messageSchema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { ApiResponse } from "@/app/types/ApiResponse";
import { toast } from "sonner";
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const PublicProfileLink = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [loading, setLoading] = useState(false);
  const [suggestMessages, setSuggestMessages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    const response = await axios.get("/api/accept-messages");
    const acceptMessageStatus = response.data.isAcceptingMessages;
    console.log(acceptMessageStatus);
    if (acceptMessageStatus === false) {
      toast.error("This user is not accepting messages currently", {
        style: { backgroundColor: "#FF0000", color: "white" },
      });
    } else {
      setLoading(true);
      try {
        const response = await axios.post<ApiResponse>("/api/send-messages", {
          ...data,
          username,
        });

        if (response.data.success) {
          toast.success("Message sent Successfully", {
            style: { backgroundColor: "#08CB00", color: "white" },
          });
        }
        form.reset({
          content: "",
        });
      } catch (error) {
        console.error("Error while send message", error);
        toast.error("Error while send message", {
          style: { backgroundColor: "#FF0000", color: "white" },
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSuggestMessages = async () => {
    try {
      const response = await axios.get("/api/suggest-messages");

      console.log("Suggest Message response", response);

      const text = response.data.data;

      if (!text || typeof text !== "string") {
        toast.error("No suggestions received from AI");
        return;
      }

      const messages = text
        .replace(/Sure!.*?:/i, "") // remove heading
        .replace(/\n/g, " ") // remove newlines
        .replace(/\d+\.\s*/g, "") // remove 1. 2. 3.
        .replace(/"/g, "") // remove quotes
        .split("||") // split messages
        .map((m) => m.trim())
        .filter(Boolean);
      setSuggestMessages(messages);
    } catch (error) {
      console.error(error);
      toast.error("AI Suggestion failed");
    }
  };

  const handleMesssageClick = (message: string) => {
    form.setValue("content", message);
  };

  return (
    
    <main className="flex flex-col items-center justify-center px-4 md:px-24 py-12">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">Public Profile Link</h1>
      </div>

      <div className="w-2xl">
        <p className="my-3 font-semibold">
          Send Anonymous Message to @{username}
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Write your anonymous message here..."
                      {...field}
                      className="p-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button type="submit">{loading ? "Please wait" : "Send"}</Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="flex flex-col self-start gap-3 ml-60 mt-20 mb-20 ">
        <Button className="py-6 px-3" onClick={handleSuggestMessages}>
          Suggest Messages
        </Button>
        <p>Click on any message below to select it</p>
      </div>

      <div className="w-full text-center">
        <Card>
          <CardHeader className="font-bold text-2xl">Messages</CardHeader>
          <CardContent>
            {suggestMessages?.map((msg, index) => (
              <p
                key={index}
                className="py-2 cursor-pointer hover:text-blue-500"
                onClick={() => handleMesssageClick(msg)}
              >
                {msg}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default PublicProfileLink;
