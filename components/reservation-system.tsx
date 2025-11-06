"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, Utensils, X, Check, AlertCircle } from "lucide-react"
import { format, isSameDay, isAfter, isBefore, endOfDay, addHours } from "date-fns"
import { es } from "date-fns/locale"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type MealType = "normal" | "hipocalorico" | "vegetariano"
type ReservationStatus = "confirmed" | "pending" | "cancelled"

interface Reservation {
  id: string
  date: Date
  mealType: MealType
  status: ReservationStatus
}

export function ReservationSystem() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [selectedMealType, setSelectedMealType] = useState<MealType>("normal")
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [activeTab, setActiveTab] = useState("new-reservation")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  // Fecha mínima: 48 horas desde ahora
  const minDate = addHours(new Date(), 48)

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    setSelectedDates((prev) => {
      const isSelected = prev.some((d) => isSameDay(d, date))
      if (isSelected) {
        return prev.filter((d) => !isSameDay(d, date))
      } else {
        return [...prev, date].sort((a, b) => a.getTime() - b.getTime())
      }
    })
  }

  const handleCreateReservation = () => {
    if (selectedDates.length === 0) return

    const newReservations: Reservation[] = selectedDates.map((date) => ({
      id: `${Date.now()}-${Math.random()}`,
      date,
      mealType: selectedMealType,
      status: "confirmed" as ReservationStatus,
    }))

    setReservations((prev) => [...prev, ...newReservations])
    setSelectedDates([])
    setShowSuccessDialog(true)
  }

  const handleCancelReservation = (id: string) => {
    setReservations((prev) => prev.map((res) => (res.id === id ? { ...res, status: "cancelled" } : res)))
  }

  const clearSelectedDates = () => {
    setSelectedDates([])
  }

  const activeReservations = reservations.filter((r) => r.status !== "cancelled")
  const upcomingReservations = activeReservations.filter((r) => isAfter(r.date, new Date()))

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Utensils className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-balance">Casino USM</h1>
            <p className="text-muted-foreground">Sistema de Reserva de Almuerzos</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4" />
          <span>Las reservas deben realizarse con al menos 48 horas de anticipación</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-reservation" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Nueva Reserva
          </TabsTrigger>
          <TabsTrigger value="my-reservations" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Mis Reservas ({upcomingReservations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new-reservation" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Calendar Section */}
            <Card>
              <CardHeader>
                <CardTitle>Seleccionar Fechas</CardTitle>
                <CardDescription>Puedes seleccionar múltiples días, incluso no consecutivos</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => setSelectedDates(dates ?? [])}
                  disabled={(date) => isBefore(endOfDay(date), minDate)}
                  locale={es}
                  className="rounded-md border"
                />

                <p className="mt-2 text-xs text-muted-foreground">
                  Primera fecha disponible: {format(minDate, "EEEE dd 'de' MMMM", { locale: es })}
                </p>

                {selectedDates.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Fechas seleccionadas:</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSelectedDates}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Limpiar
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedDates.map((date, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {format(date, "EEE dd/MM", { locale: es })}
                          <button
                            onClick={() => handleDateSelect(date)}
                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reservation Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la Reserva</CardTitle>
                <CardDescription>Configura tu preferencia de almuerzo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Tipo de Almuerzo</label>
                  <Select value={selectedMealType} onValueChange={(value: MealType) => setSelectedMealType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          Almuerzo Normal
                        </div>
                      </SelectItem>
                      <SelectItem value="hipocalorico">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          Almuerzo Hipocalórico
                        </div>
                      </SelectItem>
					  <SelectItem value="vegetariano">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          Almuerzo Vegetariano
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedDates.length > 0 && (
                  <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                    <h4 className="font-medium">Resumen de la Reserva</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Fechas seleccionadas:</span>
                        <span className="font-medium">{selectedDates.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tipo de almuerzo:</span>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              selectedMealType === "normal"
                                ? "bg-primary"
                                : selectedMealType === "hipocalorico"
                                ? "bg-green-500"
                                : "bg-orange-500"
                            }`}
                          ></div>
                          <span className="font-medium capitalize">{selectedMealType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCreateReservation}
                  disabled={selectedDates.length === 0}
                  className="w-full"
                  size="lg"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Confirmar Reserva{selectedDates.length > 1 ? "s" : ""}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="my-reservations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mis Reservas</CardTitle>
              <CardDescription>Gestiona tus reservas de almuerzo</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingReservations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tienes reservas próximas</p>
                  <Button
                    variant="outline"
                    className="mt-4 bg-transparent"
                    onClick={() => setActiveTab("new-reservation")}
                  >
                    Crear Nueva Reserva
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{format(reservation.date, "dd")}</div>
                          <div className="text-xs text-muted-foreground uppercase">
                            {format(reservation.date, "MMM", { locale: es })}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">
                            {format(reservation.date, "EEEE dd 'de' MMMM", { locale: es })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                reservation.mealType === "normal"
                                  ? "bg-primary"
                                  : reservation.mealType === "hipocalorico"
                                  ? "bg-green-500"
                                  : "bg-orange-500"
                              }`}
                            ></div>
                            Almuerzo{" "}
                            {reservation.mealType === "normal"
                              ? "Normal"
                              : reservation.mealType === "hipocalorico"
                              ? "Hipocalórico"
                              : "Vegetariano"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={reservation.status === "confirmed" ? "default" : "secondary"}>
                          {reservation.status === "confirmed" ? "Confirmada" : "Pendiente"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center items-center w-12 h-12 mx-auto bg-green-100 rounded-full">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center pt-4">Tus reservas se han realizado con exito</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)} className="w-full">
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
