import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";


const AuthButton = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return isAuthenticated ? (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={user?.picture} 
              alt={user?.name}
              referrerPolicy="no-referrer"  // Add this to handle Google image policies
            />
            <AvatarFallback>
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button 
      onClick={loginWithRedirect}
      className="mr-12"
    >
      Login
    </Button>
  );
};

export default AuthButton;
