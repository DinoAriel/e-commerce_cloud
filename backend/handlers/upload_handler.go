package handlers

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"backend/models"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type UploadHandler struct {
	S3Client *s3.Client
	Bucket   string
	Region   string
}

func NewUploadHandler() *UploadHandler {
	region := os.Getenv("AWS_REGION")
	bucket := os.Getenv("AWS_S3_BUCKET")

	// If AWS keys are not set, it might crash on startup, so we handle it gracefully
	if region == "" || bucket == "" {
		log.Println("WARNING: AWS_REGION or AWS_S3_BUCKET is not set. S3 upload will not work.")
		return &UploadHandler{}
	}

	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(region))
	if err != nil {
		log.Printf("ERROR: unable to load AWS SDK config, %v\n", err)
		return &UploadHandler{}
	}

	client := s3.NewFromConfig(cfg)

	return &UploadHandler{
		S3Client: client,
		Bucket:   bucket,
		Region:   region,
	}
}

func (h *UploadHandler) UploadImage(c *fiber.Ctx) error {
	if h.S3Client == nil {
		return models.Error(c, "Server belum dikonfigurasi untuk S3", 500)
	}

	file, err := c.FormFile("image")
	if err != nil {
		return models.Error(c, "File gambar tidak ditemukan dalam request", 400)
	}

	// Validate file extension
	ext := strings.ToLower(filepath.Ext(file.Filename))
	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".webp" {
		return models.Error(c, "Hanya menerima gambar berformat jpg, jpeg, png, atau webp", 400)
	}

	// Create a unique filename
	filename := fmt.Sprintf("%s-%s%s", time.Now().Format("20060102150405"), uuid.New().String()[:8], ext)

	// Open the file
	src, err := file.Open()
	if err != nil {
		return models.Error(c, "Gagal membaca file", 500)
	}
	defer src.Close()

	// Upload to S3
	_, err = h.S3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(h.Bucket),
		Key:    aws.String(filename),
		Body:   src,
	})
	if err != nil {
		log.Println("S3 Upload Error:", err)
		return models.Error(c, "Gagal mengunggah gambar ke AWS S3", 500)
	}

	// Construct the public URL
	imageUrl := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", h.Bucket, h.Region, filename)

	return models.Success(c, fiber.Map{
		"image_url": imageUrl,
		"message":   "Gambar berhasil diunggah",
	})
}
