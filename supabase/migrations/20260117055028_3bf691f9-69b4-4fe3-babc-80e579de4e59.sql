-- Drop the overly permissive UPDATE policy on chat_conversations
DROP POLICY IF EXISTS "Anyone can update their conversation" ON public.chat_conversations;

-- Create a proper admin-only UPDATE policy
CREATE POLICY "Admins can update conversations" 
ON public.chat_conversations 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));