import { useState } from "react";

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/;
export const phoneRegex = /^[0-9]{7,}$/;
export const idRegex = /^[0-9]{6,}$/;

export function validateVisitor(visitor) {
  const errors = {};
  if (!nameRegex.test(visitor.name)) {
    errors.name = "Nombre inválido (solo letras, mínimo 3 caracteres)";
  }
  if (!phoneRegex.test(visitor.phone)) {
    errors.phone = "Teléfono inválido (solo números, mínimo 7 dígitos)";
  }
  if (!idRegex.test(visitor.id)) {
    errors.id = "Cédula inválida (solo números, mínimo 6 dígitos)";
  }
  if (!emailRegex.test(visitor.email)) {
    errors.email = "Correo electrónico inválido";
  }
  return errors;
}
