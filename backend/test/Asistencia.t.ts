import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import {  parseEther, keccak256, stringToBytes } from "viem";
import hre from "hardhat";

describe("Asistencia", function () {
  async function deployFixture() {
    const [owner, profesor, alumno] = await hre.viem.getWalletClients();
    const publicClient = await hre.viem.getPublicClient();


    const asistencia = await hre.viem.deployContract("Asistencia", [
      "AsistenciaToken",
      "AST",
      profesor.account.address
    ]);


    const palabra = "secreto";
    const hashPalabra = keccak256(stringToBytes(palabra));

    return {
      asistencia,
      profesor,
      alumno,
      publicClient,
      palabra,
      hashPalabra,
    };
  }

  describe("Funcionalidad básica", function () {
    it("Debería registrar un alumno correctamente", async function () {
      const { asistencia, profesor, alumno } = await loadFixture(deployFixture);

      await asistencia.write.registrarAlumno([alumno.account.address], {
        account: profesor.account.address,
      });

      const esPermitido = await asistencia.read.alumnosPermitidos([
        alumno.account.address,
      ]);
      expect(esPermitido).to.be.true;
    });

    it("Debería crear una sesión correctamente", async function () {
      const { asistencia, profesor, hashPalabra } = await loadFixture(
        deployFixture
      );

      await asistencia.write.crearSesion([hashPalabra, 1n], {
        account: profesor.account.address,
      });

      const sesion = await asistencia.read.obtenerSesion([1n]);
      expect(sesion[0]).to.equal(hashPalabra);
      expect(sesion[2]).to.be.true;
    });

    it("Debería permitir reclamar tokens correctamente", async function () {
      const { asistencia, profesor, alumno, palabra, hashPalabra } =
        await loadFixture(deployFixture);


      await asistencia.write.registrarAlumno([alumno.account.address], {
        account: profesor.account.address,
      });

      await asistencia.write.crearSesion([hashPalabra, 1n], {
        account: profesor.account.address,
      });

      await asistencia.write.reclamarTokens([1n, palabra], {
        account: alumno.account.address,
      });


      const balance = await asistencia.read.balanceOf([alumno.account.address]);
      expect(balance).to.equal(parseEther("10"));
    });
  });


  describe("Casos de error", function () {
    it("No debería permitir registrar un alumno dos veces");
    it("No debería permitir crear sesión con duración 0");
    it("No debería permitir reclamar tokens a alumnos no registrados");
    it("No debería permitir reclamar tokens después del deadline");
    it("No debería permitir reclamar tokens dos veces en la misma sesión");
    it("No debería permitir usar una palabra secreta incorrecta");
  });

  describe("Roles y permisos", function () {
    it("Solo el profesor debería poder registrar alumnos");
    it("Solo el profesor debería poder crear sesiones");
  });

  describe("Inicialización del Contrato", function () {
    it("Debería tener el nombre correcto del token");
    it("Debería tener el símbolo correcto del token");
    it("Debería asignar el rol PROFE_ROLE al profesor");
    it("Debería tener un supply inicial de 0");
  });

  describe("Consultas de Estado", function () {
    it("Debería devolver los valores correctos al obtener una sesión");
    it("Debería calcular correctamente el deadline en días");
    it("Debería actualizar correctamente el estado de haReclamado");
  });

  describe("Interacción entre Funciones", function () {
    it("Debería manejar el flujo completo desde registro hasta múltiples reclamaciones");
    it("Debería manejar múltiples sesiones activas simultáneamente");
    it("Debería permitir reclamaciones en diferentes sesiones por el mismo alumno");
  });
});
