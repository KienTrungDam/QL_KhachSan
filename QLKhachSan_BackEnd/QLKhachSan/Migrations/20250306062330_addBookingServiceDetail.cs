using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QLKhachSan.Migrations
{
    /// <inheritdoc />
    public partial class addBookingServiceDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BookingServices_Services_ServiceId",
                table: "BookingServices");

            migrationBuilder.DropIndex(
                name: "IX_BookingServices_ServiceId",
                table: "BookingServices");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "BookingServices");

            migrationBuilder.RenameColumn(
                name: "ServiceId",
                table: "BookingServices",
                newName: "ServiceCount");

            migrationBuilder.AddColumn<string>(
                name: "StripePaymentIntentID",
                table: "Payments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CCCD",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfBirth",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StripePaymentIntentID",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "CCCD",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "ServiceCount",
                table: "BookingServices",
                newName: "ServiceId");

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "BookingServices",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_BookingServices_ServiceId",
                table: "BookingServices",
                column: "ServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_BookingServices_Services_ServiceId",
                table: "BookingServices",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
