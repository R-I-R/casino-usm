import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { menus } from "@/lib/menu-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Soup, Salad, Beef, Fish, Leaf, HeartPulse, Cake } from "lucide-react"

type MenuData = typeof menus;

const mealTypeIcons = {
  soup: <Soup className="h-5 w-5 text-muted-foreground" />,
  entree: <Salad className="h-5 w-5 text-muted-foreground" />,
  main1: <Beef className="h-5 w-5 text-muted-foreground" />,
  main2: <Fish className="h-5 w-5 text-muted-foreground" />,
  vegetarian: <Leaf className="h-5 w-5 text-muted-foreground" />,
  hypocaloric: <HeartPulse className="h-5 w-5 text-muted-foreground" />,
  dessert: <Cake className="h-5 w-5 text-muted-foreground" />,
};

export function MenuModal() {
  const menuKeys = Object.keys(menus) as (keyof MenuData)[];

  const renderMealItem = (label: string, value: string, icon: React.ReactNode) => (
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Ver Menú Semanal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Menú Semanal del Casino</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue={menuKeys[0]} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
            {menuKeys.map((weekKey) => (
              <TabsTrigger key={weekKey} value={weekKey}>
                {menus[weekKey].week}
              </TabsTrigger>
            ))}
          </TabsList>
          {menuKeys.map((weekKey) => (
            <TabsContent key={weekKey} value={weekKey}>
              <div className="overflow-auto max-h-[60vh] p-1">
                <div className="space-y-4">
                  {menus[weekKey].menu.map((dayMenu) => (
                    <Card key={dayMenu.day}>
                      <CardHeader>
                        <CardTitle>{dayMenu.day}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {renderMealItem("Sopa/Crema", dayMenu.soup, mealTypeIcons.soup)}
                        {renderMealItem("Entrada", dayMenu.entree, mealTypeIcons.entree)}
                        {renderMealItem("Plato de fondo 1", dayMenu.main1, mealTypeIcons.main1)}
                        {renderMealItem("Plato de fondo 2", dayMenu.main2, mealTypeIcons.main2)}
                        {renderMealItem("Vegetariano", dayMenu.vegetarian, mealTypeIcons.vegetarian)}
                        {renderMealItem("Hipocalórico", dayMenu.hypocaloric, mealTypeIcons.hypocaloric)}
                        {renderMealItem("Postre", dayMenu.dessert, mealTypeIcons.dessert)}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <DialogClose asChild>
          <Button type="button" variant="secondary" className="mt-4">
            Cerrar
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
