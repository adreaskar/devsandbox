'use client';

import { Button } from "@/components/ui/button";
import { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from "sonner"

function ContactForm() {

    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        toast.promise(
            emailjs.sendForm('service_ruo56kt', 'template_18jncxm', form.current, {
                publicKey: '7Ndt7fWhBGACYBhFE',
            }).then(() => {
                form.current.reset();
            }).catch((error) => {
                console.error('EmailJS Error:', error);
                throw error;
            }),
            {
                loading: 'Sending your message...',
                success: 'Message sent successfully!',
                error: 'Failed to send message, please try again later.',
            }
        );
    };

    return (

        <form
            ref={form}
            onSubmit={sendEmail}
            className="border border-dashed rounded-md border-border p-5 h-[calc(100%-2.5rem)] "
        >
            <div className="flex flex-col gap-4 h-full">
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    className="font-mono w-full px-4 py-3 border border-border rounded-md bg-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    className="font-mono w-full px-4 py-3 border border-border rounded-md bg-muted focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <textarea
                    name="message"
                    placeholder="Your Message"
                    defaultValue="Shut up and take my money!"
                    className="font-mono grow w-full px-4 py-3 border border-border rounded-md bg-muted h-32 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                ></textarea>
                <Button
                    type="submit"
                    className="self-start bottom-0 rounded-sm mt-auto"
                >
                    Get Access
                </Button>
            </div>
        </form>
    )

}

export default ContactForm