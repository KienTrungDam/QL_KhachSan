using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QLKhachSan.Migrations
{
    /// <inheritdoc />
    public partial class fixTable6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "UpdateBookingDate",
                table: "Bookings",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpdateBookingDate",
                table: "Bookings");
        }
    }
}
