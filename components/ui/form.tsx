import React from 'react';
export const Form = ({ children, ...props }: any) => <form {...props}>{children}</form>;
export const FormControl = ({ children }: any) => <div>{children}</div>;
export const FormField = ({ children }: any) => <div>{children}</div>;
export const FormItem = ({ children }: any) => <div>{children}</div>;
export const FormLabel = ({ children }: any) => <label>{children}</label>;
export const FormMessage = ({ children }: any) => <span>{children}</span>;
